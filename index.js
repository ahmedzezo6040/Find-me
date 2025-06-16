// عند تحميل الصفحة بالكامل، يتم تنفيذ هذا الكود
document.addEventListener("DOMContentLoaded", function() {

  // التحقق من دعم المتصفح لتحديد الموقع الجغرافي
  if (navigator.geolocation) {
    
    // طلب الموقع من المستخدم، وإذا نجح نحصل على الإحداثيات
    navigator.geolocation.getCurrentPosition(
      function(position) {
        // استخراج خط العرض وخط الطول من كائن الموقع
        var latitude = position.coords.latitude;
        var longitude = position.coords.longitude;

        // عرض الإحداثيات داخل الصفحة
        document.getElementById("latitude").innerText = latitude;
        document.getElementById("longitude").innerText = longitude;

        // تخزين الإحداثيات في المتغيرات العامة لاستخدامها لاحقًا
        window.myLatitude = latitude;
        window.myLongitude = longitude;

        // تفعيل زر عرض الخريطة وزر البحث بعد التأكد من الحصول على الموقع
        document.getElementById("showMapBtn").disabled = false;
        document.getElementById("searchButton").disabled = false;
      },
      // في حال حدوث خطأ أثناء الحصول على الموقع
      function(error) {
        document.getElementById("status").innerText = "حدث خطأ في تحديد الموقع: " + error.message;
      }
    );

  } else {
    // المتصفح لا يدعم خاصية تحديد الموقع الجغرافي
    document.getElementById("status").innerText = "المتصفح لا يدعم تحديد الموقع.";
  }

  // عند الضغط على زر "Find Me" يتم عرض خريطة موجهة إلى موقعي الحالي
  document.getElementById("showMapBtn").addEventListener("click", function() {
    if (window.myLatitude && window.myLongitude) {
      document.getElementById("map").src = "https://maps.google.com/maps?q=" + window.myLatitude + "," + window.myLongitude + "&output=embed";
    }
  });

}); // نهاية الكود الذي يتم تنفيذه بعد تحميل الصفحة

// دالة للبحث عن أماكن قريبة من الموقع الحالي بناءً على نوع المكان المدخل
function searchNearby() {
  // أخذ قيمة نوع المكان من خانة الإدخال
  const place = document.getElementById("placeType").value;

  // التأكد من أن المستخدم أدخل نوع المكان
  if (!place) {
    alert("الرجاء إدخال نوع المكان الذي تبحث عنه");
    return;
  }

  // التحقق من دعم تحديد الموقع
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      // أخذ الإحداثيات
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      // تكوين نص البحث المطلوب لإرساله إلى خرائط جوجل
      const query = `${place} near ${latitude},${longitude}`;

      // إنشاء رابط لخريطة تحتوي على نتائج البحث
      const mapSrc = `https://maps.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;

      // عرض الخريطة في العنصر الذي يحتوي على id="mape"
      document.getElementById("mape").innerHTML = `<iframe src="${mapSrc}"></iframe>`;
    }, function(error) {
      // عرض رسالة خطأ إذا لم يتمكن من الحصول على الموقع
      alert("تعذر الحصول على الموقع. تأكد من تفعيل GPS أو السماح بالموقع.");
    });
  } else {
    alert("المتصفح لا يدعم تحديد الموقع الجغرافي");
  }
}

// عند الضغط على زر "Search" يتم إخفاء الخريطة الرئيسية وعرض خريطة البحث
document.getElementById("search").addEventListener("click", function() {
  document.getElementById("map").style.display = "none";
  document.getElementById("mape").style.display = "block";
});

// عند الضغط على زر "Find Me" يتم إخفاء خريطة البحث وعرض خريطتي الحالية
document.getElementById("showMapBtn").addEventListener("click", function() {
  document.getElementById("map").style.display = "block";
  document.getElementById("mape").style.display = "none";
});


const filterContainer = document.querySelector(".gallery-filter"),
 galleryItems = document.querySelectorAll(".gallery-item");

 filterContainer.addEventListener("click", (event) =>{
   if(event.target.classList.contains("filter-item")){
   	 // deactivate existing active 'filter-item'
   	 filterContainer.querySelector(".active").classList.remove("active");
   	 // activate new 'filter-item'
   	 event.target.classList.add("active");
   	 const filterValue = event.target.getAttribute("data-filter");
   	 galleryItems.forEach((item) =>{
       if(item.classList.contains(filterValue) || filterValue === 'all'){
       	item.classList.remove("hide");
       	 item.classList.add("show");
       }
       else{
       	item.classList.remove("show");
       	item.classList.add("hide");
       }
   	 });
   }
 });

  // دالة لتطبيق الفلاتر المحددة من المستخدم
function applyFilters() {
  // الحصول على القيمة المختارة من فلتر النوع
  const typeFilter = document.getElementById("typeFilter").value;

  // الحصول على القيمة المختارة من فلتر التقييم
  const ratingFilter = document.getElementById("ratingFilter").value;

  // اختيار جميع عناصر البطاقات من الصفحة
  const cards = document.querySelectorAll(".card-item");

  // تكرار على كل بطاقة لفحص ما إذا كانت تطابق الفلاتر
  cards.forEach(card => {
    // قراءة نوع البطاقة من خاصية data-type
    const cardType = card.getAttribute("data-type");

    // قراءة تقييم البطاقة من خاصية data-rating
    const cardRating = card.getAttribute("data-rating");

    // التحقق من تطابق النوع مع الفلتر (أو "all" يعني الكل مقبول)
    const typeMatch = (typeFilter === "all" || cardType === typeFilter);

    // التحقق من تطابق التقييم مع الفلتر (أو "all" يعني الكل مقبول)
    const ratingMatch = (ratingFilter === "all" || cardRating === ratingFilter);

    // إذا كانت البطاقة تطابق النوع والتقييم، يتم عرضها
    if (typeMatch && ratingMatch) {
      card.style.display = "block";
    } else {
      // إذا لم تطابق، يتم إخفاؤها
      card.style.display = "none";
    }
  });
}
