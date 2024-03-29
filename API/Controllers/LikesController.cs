﻿using API.Controllers;
using Microsoft.AspNetCore.Mvc;

namespace API;
public class LikesController:BaseApiController
{
    private readonly ILikesRepository _likesRepository;
    private readonly IUserRepository _userRepository;

    public LikesController(IUserRepository userRepository,ILikesRepository likesRepository)
    {
        _likesRepository = likesRepository;
        _userRepository = userRepository;
    }
    [HttpPost("{username}")]
    public async Task<ActionResult> AddLike(string username)
    {
        var sourceUserId = User.GetUserId();
        var likedUser = await _userRepository.GetUserByUsernameAsync(username);
        var sourceUser = await _likesRepository.GetUserWithLikes(sourceUserId);

        if(likedUser==null) return NotFound();
        if(sourceUser.UserName ==username) return BadRequest("cannot like yrself");

        var userLike = await _likesRepository.GetUserLike(sourceUserId,likedUser.Id);

        if(userLike != null) return BadRequest("u already like this user");

        userLike = new UserLike{
            SourceUserId = sourceUserId,
            TargetUserId = likedUser.Id
        };

        sourceUser.LikedUsers.Add(userLike);
        if(await _userRepository.SaveAllAsync()) return Ok();
        return BadRequest("Failed to like user");

    }

    [HttpGet]
    public async Task<ActionResult<PagedList<LikeDto>>> GetUserLikes([FromQuery]LikesParams likesParams)
    {
        likesParams.UserId = User.GetUserId();
        var users = await _likesRepository.GetUserLikes(likesParams);
        Response.AddPaginationHeader(new PaginationHeader(users.CurrentPage,users.PageSize,users.TotalCount,users.TotalPages));

        return Ok(users);
    }

}
