import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GalleryItem, GalleryModule, ImageItem } from 'ng-gallery';
import { TabDirective, TabsModule, TabsetComponent } from 'ngx-bootstrap/tabs';
import { TimeagoModule } from 'ngx-timeago';
import { Member } from 'src/app/_models/member';
import { MembersService } from 'src/app/_services/members.service';
import { MemberMessagesComponent } from '../member-messages/member-messages.component';
import { MessageService } from 'src/app/_services/message.service';
import { Message } from 'src/app/_models/message';

@Component({
  selector: 'app-member-details',
  templateUrl: './member-details.component.html',
  standalone:true,
  styleUrls: ['./member-details.component.css'],
  imports:[CommonModule,TabsModule,GalleryModule,TimeagoModule,MemberMessagesComponent]
})
export class MemberDetailsComponent implements OnInit{
  @ViewChild('memberTabs',{static: true}) memberTabs?: TabsetComponent;
  member: Member = {} as Member;
  images: GalleryItem[] = [];
  activeTab?:TabDirective;
  messages: Message[] = [];

  constructor(private memberService: MembersService,private route: ActivatedRoute,
              private messageService: MessageService) {
  }
  ngOnInit(): void {
    this.route.data.subscribe({
      next: data => this.member = data['member']
    })
    this.route.queryParams.subscribe({
      next: params => {
        params['tab'] && this.selectTab(params['tabs'])
      }
    })
    this.getImges()
  }
  
  onTabActivated(data: TabDirective){
    this.activeTab = data;
    if(this.activeTab.heading === 'Messages') {
       this.loadMessages();
    }
  }

  

  selectTab(heading: string) {
    if(this.memberTabs) {
      this.memberTabs.tabs.find(x=>x.heading ===heading)!.active = true;
    }
  }

  getImges() {
    if(!this.member) return;
    for(const photo of this.member?.photos) {
      this.images.push(new ImageItem({src: photo.url, thumb: photo.url}));
    }

  }

  loadMessages() {
    if(this.member)
    {
      this.messageService.getMessageThread(this.member.userName).subscribe({
        next: messages=>this.messages = messages
      })
    }
  }
 
}
