
if(window.location.pathname==="/"){
    const mainMenu = document.querySelector("#schedule")
    const getSchedule = document.querySelector("#getSchedule")
    const group = document.querySelector("#groupName")

    group.addEventListener('keyup',(e)=>{
        if(!group.value){
            getSchedule.disabled = true
        }else{
            getSchedule.disabled = false
        }
    })

    getSchedule.addEventListener('click',async ()=>{
        const response =  await axios.get(`/timeTable/id:${group.value}`)
        let html = ``;
        if(response.data){
            console.log(response.data.schedule)
        dayOfTheWeak=['Понедельник','Вторник','Среда','Четверг','Пятница']
        html = response.data.schedule.map((e,i)=>{
            return `
        <table>
            <thead>
                <span class="day_of_the_week">${dayOfTheWeak[i]}</span>
                <tr>
                    <th>1 пара</th>
                    <th>2 пара</th>
                    <th>3 пара</th>
                    <th>4 пара</th>
                </tr>
            </thead>

              <tbody>
    
                <tr style="border: none;">
                    <td >
                        <div class="input-field">
                            <input value=${e[0].subject}  readonly>
                            <span class="helper-text">Предмет</span>
                        </div>
                        <div class="input-field">
                            <input value=${e[0].teacher} readonly>
                            <span class="helper-text">Препод</span>
                        </div>
                    </td>
                        
                    <td>
                      <div class="input-field">
                            <input value=${e[1].subject}  readonly>
                            <span class="helper-text">Предмет</span>
                        </div>
                        <div class="input-field">
                            <input value=${e[1].teacher} readonly>
                            <span class="helper-text">Препод</span>
                        </div>
                    </td>

                    <td>
                        <div class="input-field">
                            <input value=${e[2].subject}  readonly>
                            <span class="helper-text">Предмет</span>
                        </div>
                        <div class="input-field">
                            <input value=${e[2].teacher} readonly>
                            <span class="helper-text">Препод</span>
                        </div>
                    </td>
                    
                    <td>
                       <div class="input-field">
                            <input value=${e[3].subject}  readonly>
                            <span class="helper-text">Предмет</span>
                        </div>
                        <div class="input-field">
                            <input value=${e[3].teacher} readonly>
                            <span class="helper-text">Препод</span>
                        </div>
                    </td>
                </tr>
              
            </tbody>
    
        </table>
                `
        })
        }else{
                window.M.toast({html:"Группа не существует"})
        }
        mainMenu.innerHTML = html
        getSchedule.disabled = true
        group.value = ''
    })
}