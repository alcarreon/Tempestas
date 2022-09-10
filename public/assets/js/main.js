/*
	Astral by Pixelarity
	pixelarity.com | hello@pixelarity.com
	License: pixelarity.com/license
*/

(function ($) {
  var $window = $(window),
    $body = $("body"),
    $wrapper = $("#wrapper"),
    $main = $("#main"),
    $panels = $main.children(".panel"),
    $nav = $("#nav"),
    $nav_links = $nav.children("a");

  // Breakpoints.
  breakpoints({
    xlarge: ["1281px", "1680px"],
    large: ["981px", "1280px"],
    medium: ["737px", "980px"],
    small: ["361px", "736px"],
    xsmall: [null, "360px"],
  });

  // Play initial animations on page load.
  $window.on("load", function () {
    window.setTimeout(function () {
      $body.removeClass("is-preload");
    }, 100);
  });

  // Nav.
  $nav_links.on("click", function (event) {
    var href = $(this).attr("href");

    // Not a panel link? Bail.
    if (href.charAt(0) != "#" || $panels.filter(href).length == 0) return;

    // Prevent default.
    event.preventDefault();
    event.stopPropagation();

    // Change panels.
    if (window.location.hash != href) window.location.hash = href;
  });

  // Panels.

  // Initialize.
  (function () {
    var $panel, $link;

    // Get panel, link.
    if (window.location.hash) {
      $panel = $panels.filter(window.location.hash);
      $link = $nav_links.filter('[href="' + window.location.hash + '"]');
    }

    // No panel/link? Default to first.
    if (!$panel || $panel.length == 0) {
      $panel = $panels.first();
      $link = $nav_links.first();
    }

    // Deactivate all panels except this one.
    $panels.not($panel).addClass("inactive").hide();

    // Activate link.
    $link.addClass("active");

    // Reset scroll.
    $window.scrollTop(0);
  })();

  // Hashchange event.
  $window.on("hashchange", function (event) {
    var $panel, $link;

    // Get panel, link.
    if (window.location.hash) {
      $panel = $panels.filter(window.location.hash);
      $link = $nav_links.filter('[href="' + window.location.hash + '"]');

      // No target panel? Bail.
      if ($panel.length == 0) return;
    }

    // No panel/link? Default to first.
    else {
      $panel = $panels.first();
      $link = $nav_links.first();
    }

    // Deactivate all panels.
    $panels.addClass("inactive");

    // Deactivate all links.
    $nav_links.removeClass("active");

    // Activate target link.
    $link.addClass("active");

    // Set max/min height.
    $main
      .css("max-height", $main.height() + "px")
      .css("min-height", $main.height() + "px");

    // Delay.
    setTimeout(function () {
      // Hide all panels.
      $panels.hide();

      // Show target panel.
      $panel.show();

      // Set new max/min height.
      $main
        .css("max-height", $panel.outerHeight() + "px")
        .css("min-height", $panel.outerHeight() + "px");

      // Reset scroll.
      $window.scrollTop(0);

      // Delay.
      window.setTimeout(
        function () {
          // Activate target panel.
          $panel.removeClass("inactive");

          // Clear max/min height.
          $main.css("max-height", "").css("min-height", "");

          // IE: Refresh.
          $window.triggerHandler("--refresh");

          // Unlock.
          locked = false;
        },
        breakpoints.active("small") ? 0 : 500
      );
    }, 250);
  });

  // IE: Fixes.
  if (browser.name == "ie") {
    // Fix min-height/flexbox.
    $window.on("--refresh", function () {
      $wrapper.css("height", "auto");

      window.setTimeout(function () {
        var h = $wrapper.height(),
          wh = $window.height();

        if (h < wh) $wrapper.css("height", "100vh");
      }, 0);
    });

    $window.on("resize load", function () {
      $window.triggerHandler("--refresh");
    });

    // Fix intro pic.
    $(".panel.intro").each(function () {
      var $pic = $(this).children(".pic"),
        $img = $pic.children("img");

      $pic
        .css("background-image", "url(" + $img.attr("src") + ")")
        .css("background-size", "cover")
        .css("background-position", "center");

      $img.css("visibility", "hidden");
    });
  }
})(jQuery);

// tempestas
const deleteBtn = document.querySelectorAll(".del");
const selectZip = document.querySelectorAll(".zip");

Array.from(deleteBtn).forEach((el) => {
  el.addEventListener("click", deleteLocation);
});

Array.from(selectZip).forEach((el) => {
  el.addEventListener("click", getForecast);
});

async function deleteLocation() {
  const locationId = this.parentNode.dataset.id;
  // const clientZip = this.parentNode.querySelector(".zip").innerText;
  console.log("it deleted");
  // console.log("this is the location id " + locationId);
  // console.log("this is the zip code " + clientZip);
  //   console.log("hi");
  try {
    const response = await fetch("location/deleteLocation", {
      method: "delete",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        locationIdFromJSFile: locationId,
      }),
    });
    const data = await response.json();
    console.log(data);
    location.reload();
  } catch (err) {
    console.log(err);
  }

  try {
    const response = await fetch("todos/deleteTodo", {
      method: "delete",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        todoIdFromJSFile: todoId,
      }),
    });
    const data = await response.json();
    console.log(data);
    location.reload();
  } catch (err) {
    console.log(err);
  }
}
// console.log("hi");

async function getForecast() {
  // console.log("hi");
  const locationId = this.parentNode.dataset.id;
  const clientZip = this.parentNode.querySelector(".zip").innerText;
  console.log("this is the location id " + locationId);
  console.log("this is the zip code " + clientZip);
  try {
    const response = await fetch("location/checkedLocation", {
      method: "put",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        locationIdFromJSFile: locationId,
        zipFromJSFile: clientZip,
      }),
    });
    const data = await response.json();
    console.log(data);
    location.reload();
  } catch (err) {
    console.log(err);
  }
}

navigator.permissions
  .query({ name: "geolocation" })
  .then((permissionStatus) => {
    if (permissionStatus.state == "granted") {
      navigator.geolocation.getCurrentPosition((position) => {
        let lat = position.coords.latitude;
        let lon = position.coords.longitude;
        console.log(lat);
        console.log(lon);

        // console.log(document.querySelector("h1"));
        // document.querySelector("h1").innerText = lat;
      });
    }
    if (permissionStatus.state == "denied") {
      // do a fetch here

      let lat = 34.0522342;
      let lon = -118.2436849;
      console.log(lat);
      console.log(lon);
    }
  });
