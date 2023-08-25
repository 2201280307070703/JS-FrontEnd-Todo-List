function solve(){
    const BASE_URL="http://localhost:3030/jsonstore/tasks/";  

    const inputTitleDomElement=document.getElementById("title");
    const addBtn=document.getElementById("add-button");
    const loadBtn=document.getElementById("load-button");
    const toDoListContainer=document.getElementById("todo-list");

    loadBtn.addEventListener("click", loadTasks);
    addBtn.addEventListener("click", addingTask);

   async function loadTasks(e){
    if(e){
        e.preventDefault();
    }
    clearTasksContainer();
        try{
            const result=await fetch(BASE_URL);
            const allTasks=await result.json();

            Object.values(allTasks).forEach((task)=>{
                const li=document.createElement("li");
                li.setAttribute("id", task._id);
                toDoListContainer.appendChild(li);

                const span=document.createElement("span");
                span.textContent=task.name;
                li.appendChild(span);

                const removeBtn=document.createElement("button");
                removeBtn.textContent="Remove";
                li.appendChild(removeBtn);

                const editBtn=document.createElement("button");
                editBtn.textContent="Edit";
                li.appendChild(editBtn);

                removeBtn.addEventListener("click", removeTask);
                editBtn.addEventListener("click", getTaskForEdit);
            })
        }catch(err){
            console.error(err);
        }
    }

    async function addingTask(e){
        e.preventDefault();
        const taskName=inputTitleDomElement.value;

        const httpHeaders={
            method:"POST",
            body:JSON.stringify({name:taskName})
        }

        try{
            await fetch(BASE_URL, httpHeaders);
        }catch(err){
            console.error(err);
        }

        loadTasks();
        clearInputs();
    }

    function getTaskForEdit(){
        const parent=this.parentElement;
        const[name, _removeBtn, editBtn]=Array.from(parent.children);
        const titleName=name.textContent;

        name.remove();
        editBtn.remove();

        const input=document.createElement("input");
        input.value=titleName;
        parent.prepend(input);

        const submitBtn=document.createElement("button");
        submitBtn.textContent="Submit";
        parent.appendChild(submitBtn);

        submitBtn.addEventListener("click", editTask);
    }

    async function editTask(){
        const title=this.parentElement.querySelector("input").value;
        const parentId=this.parentElement.id;

        const httpHeaders={
            method:"PATCH",
            body:JSON.stringify({name:title})
        }
        try{
            await fetch(`${BASE_URL}${parentId}`, httpHeaders)
        }catch(err){
            console.error(err);
        }

        loadTasks();
    }
   async function removeTask(){
        const parent=this.parentElement;

        const httpHeaders={
            method:"DELETE"
        }

        try{
          await fetch(`${BASE_URL}${parent.id}`,httpHeaders)
        }catch(err){
            console.error(err);
        }

        loadTasks();
    }

    function clearInputs(){
        inputTitleDomElement.value="";
    }

    function clearTasksContainer(){
        toDoListContainer.innerHTML="";
    }
}

solve();