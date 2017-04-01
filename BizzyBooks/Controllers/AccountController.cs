using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Restaurant.Controllers
{
    public class AccountController : Controller
    {
        //
        // GET: /Account/
        public ActionResult Login()
        {
            return View();
        }
        public ActionResult Home()
        {
            return View();
            //Test

        }

        //public ActionResult Index()
        //{
        //    return View();
        //}
    }
}