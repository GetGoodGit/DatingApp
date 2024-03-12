import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GalleryItem, GalleryModule, ImageItem } from 'ng-gallery';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { Member } from 'src/app/_models/member';
import { MembersService } from 'src/app/_services/members.service';

@Component({
  selector: 'app-member-details',
  templateUrl: './member-details.component.html',
  standalone:true,
  styleUrls: ['./member-details.component.css'],
  imports:[CommonModule,TabsModule,GalleryModule]
})
export class MemberDetailsComponent implements OnInit{
  member: Member | undefined;
  images: GalleryItem[] = [];

  constructor(private memberService: MembersService,private route: ActivatedRoute) {
  }
  ngOnInit(): void {
    this.loadMember();
  }
  loadMember() {
    var username = this.route.snapshot.paramMap.get('username');
    if(!username) return;
    this.memberService.getMember(username).subscribe({
      next: member => {
        this.member = member,
        this.getImges()
      }
    })
  }

  getImges() {
    if(!this.member) return;
    for(const photo of this.member?.photos) {
      this.images.push(new ImageItem({src: photo.url, thumb: photo.url}));
    }

  }
 
}
