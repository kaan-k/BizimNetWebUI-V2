(function(window) {

    window["env"] = window["env"] || {};
      // var apiImageUrl = `${window.location.protocol}//${window.location.hostname}` + ":2083/";
      // window["env"]["apiUrl"] = `${window.location.protocol}//${window.location.hostname}` + ":2083/api/";
  
      // window["env"]["allowedDomains"] = [window.location.hostname +":2083"];

    var apiImageUrl = "https://localhost:44391/"
    window["env"]["apiUrl"] = "https://localhost:44391/api/";
  
    window["env"]["allowedDomains"] = ["localhost:44391"];



    window["env"]["userImage"] = apiImageUrl + "Uploads/User/";
    window["env"]["employeeImage"] = apiImageUrl + "Uploads/Employee/";
    window["env"]["categoryImage"] = apiImageUrl + "Uploads/FoodCategory/";
    window["env"]["menuImage"] = apiImageUrl + "Uploads/Menu/";
    window["env"]["dutyImageBefore"] = apiImageUrl + "Uploads/BeforeCleaning/";
    window["env"]["dutyImageAfter"] = apiImageUrl + "Uploads/AfterCleaning/";
    window["env"]["technicalErrorImageBefore"] = apiImageUrl + "Uploads/TechnicalError/";
    window["env"]["propertyImage"] = apiImageUrl + "Uploads/LostProperty/";
    window["env"]["noImage"] = apiImageUrl + "Uploads/Images/noimage.jpg";
  })(this);


