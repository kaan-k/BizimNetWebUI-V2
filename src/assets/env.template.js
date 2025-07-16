(function(window) {

  window["env"] = window["env"] || {};
  var apiImageUrl = "${API_IMAGES_URL}"
  window["env"]["apiUrl"] = "${API_URL}";
  allowedDomains ="${API_URL_ALLOWEDDOMAINS}";
  window["env"]["allowedDomains"]=allowedDomains.split(",");


  window["env"]["userImage"] = apiImageUrl + "/Uploads/User/";
  window["env"]["employeeImage"] = apiImageUrl + "/Uploads/Employee/";
  window["env"]["categoryImage"] = apiImageUrl + "/Uploads/FoodCategory/";
  window["env"]["menuImage"] = apiImageUrl + "/Uploads/Menu/";
  window["env"]["dutyImageBefore"] = apiImageUrl + "/Uploads/BeforeCleaning/";
  window["env"]["dutyImageAfter"] = apiImageUrl + "/Uploads/AfterCleaning/";
  window["env"]["technicalErrorImageBefore"] = apiImageUrl + "Uploads/TechnicalError/";
  window["env"]["propertyImage"] = apiImageUrl + "/Uploads/LostProperty/";
  window["env"]["noImage"] = apiImageUrl + "/Uploads/Images/noimage.jpg";
})(this);