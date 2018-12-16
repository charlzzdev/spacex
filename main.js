document.addEventListener('DOMContentLoaded', () => {
      let select = document.getElementById('select');
      let dropdown = document.getElementsByClassName('dropdown')[0];
      let loadingSpinner = document.getElementById('loading-spinner');

      handleDropdown = (action, e) => {
            if(action === 'open'){
                  dropdown.style = `left:${e.clientX - 200}px; opacity: 1; transform: scale(1);`;
                  dropdown.setAttribute('data-open', 'true');
            } else{
                  dropdown.style = `left:${e.clientX - 200}px; opacity: 0; transform: scale(0);`;
                  dropdown.setAttribute('data-open', 'false');
            }
      }

      document.addEventListener('click', (e) => {
            if(e.toElement.id === 'select'){
                  if(dropdown.getAttribute('data-open') === 'false'){
                        handleDropdown('open', e);
                  } else{
                        handleDropdown('close', e);
                  }
            } else{
                  if(dropdown.getAttribute('data-open') === 'true'){
                        handleDropdown('close', e);
                  }
            }

            if(e.target.className === 'dropdown-item'){
                  select.innerHTML = e.target.innerHTML;

                  let fetchKey = e.target.innerHTML.split(' ')[0];

                  fetchLaunch = (fetchKey) => {
                        loadingSpinner.style = 'display: block;';

                        fetch(`https://api.spacexdata.com/v3/launches/${fetchKey}`)
                              .then(res => res.json())
                              .then(data => {
                                    console.log(data);
                                    loadingSpinner.style = 'display: none;'
                              });
                  }

                  if(fetchKey !== 'all'){
                        fetchLaunch(fetchKey);
                  } else{
                        fetchLaunch('');
                  }
            }
      });
})