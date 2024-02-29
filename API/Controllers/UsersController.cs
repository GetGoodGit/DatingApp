using API.Data;
using Microsoft.AspNetCore.Mvc;
using API.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

namespace API.Controllers;
[Authorize]
public class UsersController : BaseApiController
{
    private readonly DataContext _context;
    public UsersController(DataContext context)
    {
        _context = context;
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
    [AllowAnonymous]
    [HttpGet]
    public async Task<ActionResult<IEnumerable<AppUser>>> GetUsers()
    {
        var users = await _context.Users.ToListAsync();

        return users;
    }
    
    [HttpGet("{id}")]  //  /api/users/id
    public async Task<ActionResult<AppUser>> GetUser(int id)  //Users is tableName
    {
        return await _context.Users.FindAsync(id);
    }
}
