document.addEventListener('DOMContentLoaded', () => {
      let select = document.getElementById('select');
      let dropdown = document.querySelector('.dropdown');
      let loadingSpinner = document.getElementById('loading-spinner');
      let result = document.querySelector('.result');

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
                                    if(data.length === undefined) data = [data];

                                    console.log(data);

                                    render('', true);

                                    data.forEach(data => {
                                          let launch_result = '';
                                          if(data.launch_success){
                                                launch_result = '- successful';
                                          } else if(data.launch_success === false) launch_result= '- failure';
                                          
                                          render(`
                                                <div class="rocket">
                                                      ${typeof data.links.mission_patch_small === 'string' ? `<img src=${data.links.mission_patch_small} alt="mission-patch" class="mission-patch">` : ''}
                                                      <span class="date">${new Date(data.launch_date_local)}</span>
                                                      <h1>Flight #${data.flight_number} ${launch_result}</h1>
                                                      <h2>Mission ${data.mission_name}: ${data.rocket.rocket_name} Rocket</h2>
                                                      <p>${typeof data.details === 'string' ? data.details : ''}</p>
                                                      <p>Launch site: ${data.launch_site.site_name_long}</p>
                                                      ${typeof data.links.reddit_campaign === 'string' ? `<a href=${data.links.reddit_campaign} target="blank">View Reddit Campaign <i class="fas fa-external-link-alt"></i></a>` : ''}
                                                      ${typeof data.links.video_link === 'string' ? `<a href=${data.links.video_link} target="blank">View Video <i class="fas fa-video"></i>` : ''}
                                                </div>
                                          `);
                                    });

                                    loadingSpinner.style = 'display: none;'
                              })
                              .catch(err => {
                                    console.log(err);
                                    render('error', true);
                                    loadingSpinner.style = 'display: none;';
                              });
                  }

                  if(fetchKey !== 'all'){
                        fetchLaunch(fetchKey);
                  } else{
                        fetchLaunch('');
                  }
            }
      });

      render = (html, clear) => {
            if(clear){
                  result.innerHTML = '';
            }

            result.innerHTML += html;
      }
});