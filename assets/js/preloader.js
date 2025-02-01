
  const introAnimation = lottie.loadAnimation({
    container: document.getElementById("page-preloader"),
    renderer: "svg",
    loop: false,
    autoplay: false,
    path: `${window.backend_data.site_info.site_url}/wp-content/themes/nesting-house/assets/lottie/intro.json`, //this is the URL of the lottie file you want to use
    rendererSettings: {
      progressiveLoad: false
    }
  });

  const loaderAnimation = () => {
    return new Promise((resolve) => {
      if(window.sessionStorage.getItem("loaderAnimationPlayed")) {
        document.getElementById("page-preloader").style.display = "none";
        resolve();
        return;
      } else {
        introAnimation.play();
        introAnimation.addEventListener("complete", () => {
          document.querySelector("#page-preloader > svg").style.opacity = 0;
          setTimeout(() => {
            document.getElementById("page-preloader").style.opacity = 0;
          }, 1000);
          setTimeout(() => {
            document.getElementById("page-preloader").style.display = "none";
            resolve();
          }, 1100);
        });
        window.sessionStorage.setItem("loaderAnimationPlayed", true);
      }

    });
  } 
  



