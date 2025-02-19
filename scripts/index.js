const myButton = () => {
  let button = document.getElementById("intro-button");
  button.addEventListener("click", function(){
      window.location.href = "mainpage.html"
  })
}
export default myButton();