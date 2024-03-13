using API.Data;
using Microsoft.AspNetCore.Mvc;
using API.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using AutoMapper;
using API.DTOs;
using System.Security.Claims;

namespace API.Controllers;
[Authorize]
public class UsersController : BaseApiController
{
    private readonly IUserRepository _userRepository;
    private readonly IMapper _mapper;

    public UsersController(IUserRepository userRepository,IMapper mapper)
    {
        _mapper = mapper;
        _userRepository = userRepository;
    }
    
    /*  // this is synchronous method
    [HttpGet]
    public ActionResult<IEnumerable<AppUser>> GetUsers()
    {
        var users = _context.Users.ToList();

        return users;
    }
    */

    // writing asynchronous method for above code
    // async passes the request to other thread and get data
    // from data base then returns to main thread
    [HttpGet]
    public async Task<ActionResult<IEnumerable<MemberDto>>> GetUsers()
    {
        var users = await _userRepository.GetMembersAsync();
    
        return Ok(users);
    }
    
    [HttpGet("{username}")]  //  /api/users/id
    public async Task<ActionResult<MemberDto>> GetUser(string username)  //Users is tableName
    {
        return await _userRepository.GetMemberAsync(username);
    }

    [HttpPut]
    public async Task<ActionResult> UpdateUser(MemberUpdateDto memberUpdateDto)
    {
        var username = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var user = await _userRepository.GetUserByUsernameAsync(username);

        if(user==null) return NotFound();
        _mapper.Map(memberUpdateDto,user);

        if(await _userRepository.SaveAllAsync()) return NoContent();
        return BadRequest("Failed to update user");
    }
}
