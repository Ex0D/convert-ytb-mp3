const animateButton = (e) =>
{
    e.preventDefault;
    //reset animation
    e.target.classList.remove('animate');

    e.target.classList.add('animate');
    setTimeout(() =>
    {
      e.target.classList.remove('animate');
    }, 700);
};

const bubblyButtons = document.getElementsByClassName("bubbly-button");

for (let i = 0; i < bubblyButtons.length; i++)
{
  bubblyButtons[i].addEventListener('click', animateButton, false);
}