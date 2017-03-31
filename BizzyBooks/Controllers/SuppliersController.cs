using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace BizzyBooks.Controllers
{
    public class SuppliersController : Controller
    {
        // GET: Suppliers
        public ActionResult Suppliers()
        {
            return View();
        }
    }
}