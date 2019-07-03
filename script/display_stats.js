function display_stats(stats) {
tab = stats.replace(/&#34;/g, '\"')
stat = JSON.parse(tab);
//console.log(tab);

var counter = document.getElementById('terminated_courses_counter');
counter.setAttribute("data-stop", stat.coursesTermined);

var counter = document.getElementById('current_courses_counter');
counter.setAttribute("data-stop", stat.currentCourses);

var counter = document.getElementById('no_taken_courses_counter');
counter.setAttribute("data-stop", stat.coursesNotTake);


var counter = document.getElementById('all_courses_counter');
counter.setAttribute("data-stop", stat.allCourses);

var counter = document.getElementById('all_monthly_courses_counter');
counter.setAttribute("data-stop", stat.nbCoursesMonth);

var counter = document.getElementById('all_daily_courses_counter');
counter.setAttribute("data-stop", stat.nbCoursesDay);


var counter = document.getElementById('all_clients_counter');
counter.setAttribute("data-stop", stat.nbClients);

var counter = document.getElementById('all_daily_clients_counter');
counter.setAttribute("data-stop", stat.nbClientsDay);

var counter = document.getElementById('all_monthly_clients_counter');
counter.setAttribute("data-stop", stat.nbClientsMonth);


var counter = document.getElementById('all_packages_counter');
counter.setAttribute("data-stop", stat.nbPackSaleMonth);

var counter = document.getElementById('all_entreprise_packages_counter');
counter.setAttribute("data-stop", stat.nbEntreprisePackSale);

var counter = document.getElementById('all_premium_packages_counter');
counter.setAttribute("data-stop", stat.nbPremiumPackSale);
}
