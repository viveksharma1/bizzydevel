using System.Configuration;
using System.Web;
using System.Web.Optimization;

namespace Restaurant
{
    public class BundleConfig
    {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {

            bundles.Add(new StyleBundle("~/bundles/appcss").Include(
                "~/css/bootstrap.min.css",
                "~/css/bootstrap-theme.min.css",
                "~/css/selectize.bootstrap3.min.css",
                "~/css/select.min.css",
                "~/css/datepicker.css",

                  "~/css/bootstrap-select.min.css",
                  "~/css/dataTables.min.css",
                   "~/css/angular-datatables.min.css",
                    "~/css/xeditable.css",
                    "~/css/select2.css",
                    "~/css/loader.css",
                      "~/css/accordion.min.css",
                       "~/css/loading-bar.css",
                       "~/css/bootstrap-datepicker.css",
                        "~/css/daterangepicker.css",
                        "~/css/jquery.toastmessage-min.css"

                ));




            bundles.Add(new ScriptBundle("~/bundles/angular").Include(
                   "~/js/jquery.js",
                   "~/js/datatables/jquery.dataTables.js",
                   "~/js/nicescroll/jquery.nicescroll.min.js",
                   "~/js/bootstrap.min.js",
                    "~/js/moment/moment.js",
                   "~/js/progressbar/bootstrap-progressbar.min.js",

                    "~/js/prefixfree.min.js",
                   "~/js/datepicker/daterangepicker.js",
                   "~/ScriptsAngular/Angular/angular.js",
                   "~/ScriptsAngular/Angular/angular-route.js",
                   "~/ScriptsAngular/Angular/angular-ui-router.js",
                   "~/ScriptsAngular/Angular/angular-filter.min.js",
                   "~/ScriptsAngular/Angular/src/plugins/Animate/angular-animate.js",
                   "~/ScriptsAngular/Angular/src/ui-bootstrap-tpls-0.13.4.js",
                   "~/ScriptsAngular/Angular/src/angular-sanitize.min.js",
                   "~/ScriptsAngular/Angular/angular-datatables.js",
                    "~/ScriptsAngular/Angular/src/lodash.min.js",
                     "~/ScriptsAngular/Angular/src/select.min.js",
                   "~/ScriptsAngular/Angular/angular-file-upload.js",
                   //"~/ScriptsAngular/Angular/jspdf.min.js",
                   //"~/ScriptsAngular/Angular/pixastic-standalone.js",
                   //"~/ScriptsAngular/Angular/pixastic-crop.js",
                   //"~/ScriptsAngular/Angular/ngPrint-module.js",
                   //"~/ScriptsAngular/Angular/pdfPrinter-service.js",
                   //"~/ScriptsAngular/Angular/components/directives/ngPrintable/ngPrintable-directive.js",
                   //"~/ScriptsAngular/Angular/components/directives/ngPrintButton/ngPrintButton-directive.js",

                   "~/js/pace/pace.min.js",
                   "~/js/datatables/dataTables.fixedHeader.min.js",
                    "~/js/datatables/dataTables.keyTable.min.js",
                    "~/js/datatables/dataTables.responsive.min.js",
                    "~/js/datatables/dataTables.scroller.min.js",
                    "~/js/datatables/dataTables.bootstrap.js",
                    "~/js/datatables/responsive.bootstrap.min.js",
                    "~/js/alertify.js",
                    "~/js/waitMe.js",
                    "~/js/underscore-min.js",
                    "~/js/fsm-sticky-header.js",
                   "~/js/fixedHeader.js",
                   "~/js/bootstrap-filestyle.min.js",
                    "~/js/datepicker.js",
                    "~/js/Common.js",
                      "~/js/bootstrap-select.min.js",
                       "~/js/jquery.dataTables.min.js",
                       "~/js/xeditable.js",
                        "~/js/xeditable.min.js",
                        "~/js/angular-mocks.js",
                         "~/js/select2.min.js",
                          "~/js/jspdf.min.js",
                           "~/js/accordion.min.js",
                                "~/js/loading-bar.js",
                                "~/js/bootstrap-datepicker.js",
                                "~/js/daterangepicker.js",
                                "~/js/jquery.toastmessage-min.js"



               ));
            bundles.Add(new ScriptBundle("~/bundles/appjs")
                .Include(

                  "~/js/jszip.js",
                  "~/js/jszip-utils.js",
                  "~/js/FileSaver.js",
                  "~/js/xlsx.js",
                "~/js/kendo.all.min.js",
                "~/js/custom.js",
                "~/js/sweetalert-dev.js",
                "~/js/SweetAlert.js",
                "~/js/modernizr.custom.js",
                "~/js/jquery.scrollTo.js",
                //"~/ScriptsAngular/Angular/angular.js",
                //"~/ScriptsAngular/Angular/angular-route.js",
                 //For test of Ui-Select
                 //"~/ScriptsAngular/Angular/src/angular-sanitize.min.js",
                
                 "~/js/Common.js",
                 "~/ScriptsAngular/app/App.js",
                 "~/ScriptsAngular/app/Controller/LoginCntrl.js",
                 "~/ScriptsAngular/app/Controller/CustomerCntrl.js",
                 "~/ScriptsAngular/app/Controller/SupplierCntrl.js",
                 "~/ScriptsAngular/app/Controller/CustomerdetailCntrl.js",
                 "~/ScriptsAngular/app/Controller/HomePageCntrl.js",
                 "~/ScriptsAngular/app/Controller/SearchTransactionsCntrl.js",
                 "~/ScriptsAngular/app/Controller/SupplierdetailCntrl.js",
                 "~/ScriptsAngular/app/Controller/InventoryCntrl.js",
                 "~/ScriptsAngular/app/Controller/ImportCntrl.js",
                 "~/ScriptsAngular/app/Controller/BankingCntrl.js",
                 "~/ScriptsAngular/app/Controller/SalesCntrl.js",
                 "~/ScriptsAngular/app/Controller/ExpensesCntrl.js",
                 "~/ScriptsAngular/app/Controller/LogisticsCntrl.js",
                 "~/ScriptsAngular/app/Controller/InvoiceCntrl.js",
                 "~/ScriptsAngular/app/Controller/ReceivePaymentCntrl.js",
                 "~/ScriptsAngular/app/Controller/EnquiryCntrl.js",
                 "~/ScriptsAngular/app/Controller/PurchaseOrderCntrl.js",
                 "~/ScriptsAngular/app/Controller/BillCntrl.js",
                 "~/ScriptsAngular/app/Controller/ExpenseCntrl.js",
                 "~/ScriptsAngular/app/Controller/GRNEntryCntrl.js",
                 "~/ScriptsAngular/app/Controller/AdvancePaymentCntrl.js",
                 "~/ScriptsAngular/app/Controller/MakePaymentCntrl.js",
                 "~/ScriptsAngular/app/Controller/CreateInventoryCntrl.js",
                 "~/ScriptsAngular/app/Controller/EnquirydetailCntrl.js",
                 "~/ScriptsAngular/app/Controller/PdfViewCntrl.js",
                 "~/ScriptsAngular/app/Controller/CustomerPdfViewCntrl.js",
                 "~/ScriptsAngular/app/Controller/ChartofAccountsCntrl.js",
                 "~/ScriptsAngular/app/AccountCreateDirective.js",
                 "~/ScriptsAngular/app/Controller/accountHistoryCntrl.js",
                 "~/ScriptsAngular/app/Controller/inventorystockCntrl.js",
                 "~/ScriptsAngular/app/Controller/ForexGainLossCntrl.js",
                 "~/ScriptsAngular/app/Controller/TaxInvoiceCntrl.js",
                 "~/ScriptsAngular/app/Controller/PurchaseInvoiceSattlementCntrl.js",
                 "~/ScriptsAngular/app/Controller/SalesInvoiceSattlementCntrl.js",
                 "~/ScriptsAngular/app/Controller/BadlaVoucherCntrl.js",
                 "~/ScriptsAngular/app/Controller/GeneralInvoiceCntrl.js",
                 "~/ScriptsAngular/app/Controller/JournalEntryCntrl.js",
                 "~/ScriptsAngular/app/Controller/BalanceInventoryCntrl.js",
                 "~/ScriptsAngular/app/Controller/DetailInventoryCntrl.js",
                 "~/ScriptsAngular/app/Controller/SaleInventoryCntrl.js",
                 "~/ScriptsAngular/app/Controller/ProcessInventoryCntrl.js",
                 "~/ScriptsAngular/app/Controller/BalanceInventoryViewInfoCntrl.js",
                 "~/ScriptsAngular/app/Controller/BalanceInventoryViewDetailCntrl.js",
                 "~/ScriptsAngular/app/Controller/StockBalanceInventoryCntrl.js",
                 "~/ScriptsAngular/app/Controller/VoucherTransactionsCntrl.js",
                 "~/ScriptsAngular/app/Controller/SattlementTransactionsCntrl.js",
                 "~/ScriptsAngular/app/Controller/ActivityLogCntrl.js",
                 "~/ScriptsAngular/app/Controller/ExciseInvoiceCntrl.js",
                 "~/ScriptsAngular/app/Controller/SalesInvoicePDFCntrl.js",
                 "~/ScriptsAngular/app/Controller/TaxInvoicePDFCntrl.js",
                 "~/ScriptsAngular/app/Controller/ExciseInvoicePDFCntrl.js",
                 "~/ScriptsAngular/app/Controller/BalanceSheetCntrl.js",
                 "~/ScriptsAngular/app/Controller/ProfitLossAccountCntrl.js",
                 "~/ScriptsAngular/app/Controller/MonthlySummaryCntrl.js",
                 "~/ScriptsAngular/app/Controller/DirectoryCntrl.js",
                 "~/ScriptsAngular/app/Controller/DirectoryViewCntrl.js",
                  "~/ScriptsAngular/app/Controller/SalesInvoiceCntrl.js"




                ));

            bundles.Add(new StyleBundle("~/bundles/appcss2").Include(
                "~/css/bootstrap.min.css"

                ));

            bundles.Add(new ScriptBundle("~/bundles/appjs2").Include(
                  "~/js/jquery.min.js",
                  "~/ScriptsAngular/Angular/angular.js",
                  "~/ScriptsAngular/Angular/angular-route.js",
                  "~/ScriptsAngular/app/Controller/LoginCntrl.js"

                 ));

            BundleTable.EnableOptimizations = bool.Parse(ConfigurationManager.AppSettings["BundleOptimisation"]); ;

        }
    }


}
