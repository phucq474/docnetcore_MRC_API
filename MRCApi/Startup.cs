using System;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using SpiralData;
using SpiralService;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;

namespace MRCApi
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }
        public IConfiguration Configuration { get; }
        public void ConfigureServices(IServiceCollection services)
        {
            // In production, the React files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/build";
            });
            services.AddSignalR();
            services.AddSignalRCore();
            services.AddDbContext<UserContext>();
            services.AddDbContext<EmployeeContext>();
            services.AddDbContext<ShopContext>();
            services.AddDbContext<AccountContext>();
            services.AddDbContext<RegionContext>();
            services.AddDbContext<MasterListDataContext>();
            services.AddDbContext<MenuContext>();
            services.AddDbContext<ProductContext>();
            services.AddDbContext<AttendantContext>();
            services.AddDbContext<ShiftListContext>();
            services.AddDbContext<WorkingPlanContext>();
            services.AddDbContext<HRContext>();
            services.AddDbContext<MessengerContext>();
            services.AddDbContext<DocumentContext>();
            services.AddDbContext<TimesheetContext>();
            services.AddDbContext<MappingContext>();
            services.AddDbContext<MobileContext>();
            services.AddDbContext<LogsContext>();
            services.AddDbContext<EmployeeStoreContext>();
            services.AddDbContext<SpiralFormContext>();
            services.AddDbContext<SpiralFormResultContext>();
            services.AddDbContext<CalendarContext>();
            services.AddDbContext<LanguageResourcesContext>();
            services.AddDbContext<UserPagesContext>();
            services.AddDbContext<TimeShiftContext>();
            services.AddDbContext<DashboardContext>();
            services.AddDbContext<DashboardIMVContext>();
            services.AddDbContext<CompetitorContext>();
            services.AddDbContext<CustomersContext>();
            services.AddDbContext<ProductCategoriesContext>();
            services.AddDbContext<ChannelContext>();
            services.AddDbContext<SuppliersContext>();
            services.AddDbContext<ReportContext>();
            services.AddDbContext<WorkingPlanDefaultContext>();
            services.AddDbContext<EmployeeTypeContext>();
            services.AddDbContext<OOLListsContext>();
            services.AddDbContext<OOLTargetsContext>();
            services.AddDbContext<OSAResultsContext>();
            services.AddDbContext<WorkingResultOOLContext>();
            services.AddDbContext<StockOutContext>();
            services.AddDbContext<WorkingPlanContext>();
            services.AddDbContext<WorkingPhotoContext>();
            services.AddDbContext<PromotionResultsContext>();
            services.AddDbContext<PromotionListContext>();
            services.AddDbContext<SellOutContext>();
            services.AddDbContext<OSATargetContext>();
            services.AddDbContext<ProductPriceContext>();
            services.AddDbContext<DocumentUserContext>();
            services.AddDbContext<StockoutTargetContext>();
            services.AddDbContext<SOSListContext>();
            services.AddDbContext<EmployeeAnnualLeaveContext>();
            services.AddDbContext<SOSTargetContext>();
            services.AddDbContext<SOSResultContext>();
            services.AddDbContext<QCContext>();
            services.AddDbContext<TaskListContext>();
            services.AddDbContext<ApproachContext>();
            services.AddDbContext<SellInContext>();
            services.AddDbContext<WorkingTaskContext>();
            services.AddDbContext<CustomerTargetContext>();
            services.AddDbContext<SyncDataContext>();
            services.AddDbContext<SpiralFormPermissionContext>();
            services.AddDbContext<SpiralFormStatisticalContext>();
            services.AddDbContext<TargetCoverContext>();
            services.AddDbContext<ShopByCustomerContext>();
            services.AddDbContext<DisplayContestResultsContext>();
            services.AddDbContext<SellInIMVContext>();
            services.AddDbContext<EmployeePOGContext>();
            services.AddDbContext<MobileMenuContext>();
            services.AddDbContext<EmployeeCategoryContext>();

            var appSettingsSection = Configuration.GetSection("AppSettings");
            services.Configure<AppSettings>(appSettingsSection);

            var appSettings = appSettingsSection.Get<AppSettings>();
            var key = Encoding.ASCII.GetBytes(appSettings.Secret);
            services.AddAuthentication(x =>
            {
                x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(x =>
            {
                x.RequireHttpsMetadata = false;
                x.SaveToken = true;
                x.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = false,
                    ValidateAudience = false
                };
            }
            );

            services.AddControllersWithViews()
            .AddNewtonsoftJson(options =>
            options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore
            );
            //// Reister the setting provider
            services.AddScoped<IUserService, UserService>();
            services.AddScoped<IEmployeeService, EmployeeService>();
            services.AddScoped<ISpiralFormService, SpiralFormService>();
            services.AddScoped<ISpiralFormResultService, SpiralFormResultService>();
            services.AddScoped<IAccountService, AccountService>();
            services.AddScoped<IRegionService, RegionService>();
            services.AddScoped<IMasterListDataService, MasterListDataService>();
            services.AddScoped<IMenuService, MenuService>();
            services.AddScoped<IProductService, ProductService>();
            services.AddScoped<IAttendantService, AttendantService>();
            services.AddScoped<IWorkingPlanService, WorkingPlanService>();
            services.AddScoped<IMessengerService, MessengerService>();
            services.AddScoped<IDocumentService, DocumentService>();
            services.AddScoped<ITimesheetService, TimesheetService>();
            services.AddScoped<IMappingService, MappingService>();
            services.AddScoped<IMobileService, MobileService>();
            services.AddScoped<IHRService, HRService>();
            services.AddScoped<ILogsService, LogsService>();
            services.AddScoped<IMobileService, MobileService>();
            services.AddScoped<IDashboardService, DashboardService>();
            services.AddScoped<IDashboardIMVService, DashboardIMVService>();
            services.AddScoped<ICalendarService, CalendarService>();
            services.AddScoped<ILanguageResourceService, LanguageResourcesService>();
            services.AddScoped<IUserPagesService, UserPagesService>();
            services.AddScoped<ITimeShiftService, TimeShiftService>();
            services.AddScoped<ICompetitorService, CompetitorService>();
            services.AddScoped<ICustomersService, CustomersService>();
            services.AddScoped<IProductCategoriesService, ProductCategoriesService>();
            services.AddScoped<IChannelService, ChannelService>();
            services.AddScoped<IShiftListService, ShiftListService>();
            services.AddScoped<ISuppliersService, SuppliersService>();
            services.AddScoped<IReportService, ReportService>();
            services.AddScoped<IWorkingPlanDefaultService, WorkingPlanDefaultService>();
            services.AddScoped<IEmployeeTypesService, EmployeeTypesService>();
            services.AddScoped<IOOLTargetsService, OOLTargetsService>();
            services.AddScoped<IOOLListsService, OOLListsService>();
            services.AddScoped<IOSAResultsService, OSAResultsService>();
            services.AddScoped<IWorkingResultOOLService, WorkingResultOOLService>();
            services.AddScoped<IStockOutService, StockOutService>();
            services.AddScoped<IWorkingPhotoService, WorkingPhotoService>();
            services.AddScoped<IPromotionResultsService, PromotionResultsService>();
            services.AddScoped<IPromotionListService, PromotionListService>();
            services.AddScoped<ISellOutService, SellOutService>();
            services.AddScoped<IOSATargetService, OSATargetService>();
            services.AddScoped<IProductPriceService, ProductPriceService>();
            services.AddScoped<IDocumentUserService, DocumentUserService>();
            services.AddScoped<IStockoutTargetService, StockoutTargetService>();
            services.AddScoped<ISOSListService, SOSListService>();
            services.AddScoped<IEmployeeAnnualLeaveService, EmployeeAnnualLeaveService>();
            services.AddScoped<ISOSTargetService, SOSTargetService>();
            services.AddScoped<ISOSResultService, SOSResultService>();
            services.AddScoped<IQCService, QCService>();
            services.AddScoped<IApproachService, ApproachService>();
            services.AddScoped<ITaskListService, TaskListService>();
            services.AddScoped<ISellInService, SellInService>();
            services.AddScoped<IWorkingTaskService, WorkingTaskService>();
            services.AddScoped<ICustomerTargetService, CustomerTargetService>();
            services.AddScoped<ISyncDataService, SyncDataService>();
            services.AddScoped<ISpiralFormPermissionService, SpiralFormPermissionService>();
            services.AddScoped<ISpiralFormStatisticalService, SpiralFormStatisticalService>();
            services.AddScoped<ITargetCoverService, TargetCoverService>();
            services.AddScoped<IShopByCustomerService, ShopByCustomerService>();
            services.AddScoped<IDisplayContestResultsService, DisplayContestResultsService>();
            services.AddScoped<ISellInIMVService, SellInIMVService>();
            services.AddScoped<IEmployeePOGService, EmployeePOGService>();
            services.AddScoped<IMobileMenuService, MobileMenuService>();
            services.AddScoped<IEmployeeCategoryService, EmployeeCategoryService>();


            //services.AddCors(options =>
            //{
            //    //options.AddPolicy("Spiral",
            //    builder =>
            //    {
            //        // Not a permanent solution, but just trying to isolate the problem
            //        builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
            //    });
            //});
            //services.AddControllers();
        }
        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
                app.UseHsts();
            }
            app.UseHttpsRedirection();
            app.UseSpaStaticFiles();
            app.UseStaticFiles();
            app.UseRouting();
            app.UseAuthentication();
            app.UseAuthorization();
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.MapHub<LiveHub>("/chat");
            });
            app.UseSpa(spa =>
            {
                spa.Options.SourcePath = "ClientApp";

                if (env.IsDevelopment())
                {
                    spa.UseReactDevelopmentServer(npmScript: "start");
                }
            });
        }
    }
}
