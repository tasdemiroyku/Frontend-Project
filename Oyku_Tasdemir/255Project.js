
var lists = loadListsFromStorage();
var tasks = loadTasksFromStorage();
var count;
var selectedListId = -1;

$(function(){

    renderAllLists()
    if(lists == ""){
        count = -1;
    } else {
        count = lists.length - 1;
    }

$(".newList").on("click", function(){
    selectedListId = -1;
    $(".modal").show();
    $(".modalBackground").show();
    $("#listInput").focus();
    $("#listInput").val("");
})

$("#closeBtn").on("click", function(){
    $(".modal").hide();
    $(".modalBackground").hide();
})

$("#createBtn").on("click", function(){
    let listName = $("#listInput").val().trim();
    if(listName !== "") {
        let taskCount = 0;
        let list = {"listName" : listName, "taskCount" : taskCount}
        lists.push(list)
        renderList(list)
        saveAllLists();
        count++;
        $(".modal").hide();
        $(".modalBackground").hide();
        $(".landingPage").hide();
        $(".taskPage").children().remove();
        $("*").removeClass("selector");
        $("li:last-child").addClass("selector");
        renderTaskPage(list)
    } else {
        alert("Enter a list name!")
        $("#listInput").focus();
    }
})

$("#listInput").on("keydown", function(e){
    if(e.key == "Enter") {
        let listName = $("#listInput").val().trim();
            if(listName !== "") {
                let taskCount = 0;
                let list = {"listName" : listName, "taskCount" : taskCount}
                lists.push(list)
                renderList(list)
                saveAllLists();
                count++;
                $(".modal").hide();
                $(".modalBackground").hide();
                $(".landingPage").hide();
                $(".taskPage").children().remove();
                $("*").removeClass("selector");
                $("li:last-child").addClass("selector");
                renderTaskPage(list)
            } else {
                alert("Enter a list name!")
                $("#listInput").focus(); 
            }
    }
})

$(document).on("click", "#trashcan", function(e) {
    let id = $(this).parent().index();
    $("*").removeClass("selector");
    if(id === 0){
        $(this).parent().next("li").addClass("selector");
    } else {
        $(this).parent().prev("li").addClass("selector");
    }
    $(this).parent().remove();
    lists.splice(id, 1);
    count--;
    saveAllLists();
    e.stopPropagation();
    let checkList = loadListsFromStorage()
    if(checkList == ""){
        $(".landingPage").show();
        $(".projectMembersTitle").addClass("selector");
    }

    for(i = 0; i < tasks.length; i++){
        if(tasks[i].key == id){
            tasks.splice(i, 1);
            i--;
        }
        saveAllTasks()
    }
    
    for(i = 0; i < tasks.length; i++){
        if(tasks[i].key > id){
            tasks[i].key--;
        }
        saveAllTasks()
    }
    
    if(id !== 0){
        renderTaskPage(lists[id-1])
        renderTasksOfAList(id-1)
    } else {
        renderTaskPage(lists[id])
        renderTasksOfAList(id)
    }
})



$(document).on("click", ".listItem", function(){
    $(".landingPage").hide();
    $(".taskPage").children().remove();
    $("*").removeClass("selector");
    $(this).addClass("selector");
    selectedListId = $(this).index();
    let list = lists[selectedListId]
    renderTaskPage(list)
    renderTasksOfAList(selectedListId)
})

$(".projectMembersTitle").on("click", function(){
    $(".landingPage").show();
    $("*").removeClass("selector");
    $(".projectMembersTitle").addClass("selector")
})

$(document).on("keydown", "#addTaskInput", function(e){
    if(e.key == "Enter") {
        let completed = 0;
        let taskName = $("#addTaskInput").val().trim();
        if(taskName !== "") {
            let listId; 
            if(selectedListId !== -1){
                listId = selectedListId;
            } else {
                listId = count;
            }
            let task = {"key": listId, "name": taskName, "completed": completed}
            tasks.push(task)   
            saveAllTasks()
            renderTasksOfAList(listId)
            $("#addTaskInput").val("")
            lists[listId].taskCount++;
            saveAllLists()
            renderTaskCounts()
        } else {
            alert("Enter task!")
        }
    }
})

$(document).on("click", ".taskItem", function() {
    let taskId = $(this).index();
    // alert(taskId)
    let listId; 
    if(selectedListId !== -1){
        listId = selectedListId;
    } else {
        listId = count;
    }

    if($(this).children().children().is(":checked")) {
        let cnt = -1;
        // alert(this)
        $(this).removeClass("lineThrough")
                .children().children().attr("checked", false);
        for(let t = 0; t < tasks.length; t++){
            if(tasks[t].key === listId){
                cnt++;
                if(taskId == cnt){
                    tasks[t].completed = 0;
                }
            } 
        }
        lists[listId].taskCount++;
        renderTaskCounts()
    }
    else {
        let cnt = -1;
        // alert(this)
        $(this).addClass("lineThrough")
                .children().children().attr("checked", true);
        for(let t = 0; t < tasks.length; t++){
            if(tasks[t].key === listId){
                cnt++;
                if(taskId == cnt){
                    tasks[t].completed = 1;
                }
            } 
        }
        lists[listId].taskCount--;
        renderTaskCounts()
    }
    saveAllLists()
    saveAllTasks()
})

})

function saveAllLists(){
    localStorage.setItem("lists", JSON.stringify(lists))
}

function saveAllTasks(){
    localStorage.setItem("tasks", JSON.stringify(tasks))
}

function loadListsFromStorage(){
    let data = localStorage.getItem("lists")
    return data ? JSON.parse(data) : []
}

function loadTasksFromStorage(){
    let data = localStorage.getItem("tasks")
    return data ? JSON.parse(data) : []
}

function renderAllLists(){
    for (let l of lists){
        renderList(l)
    }
}

function renderList(list){
    $(".lists").append(`<li class="listItem">
                            <i id="menuicon" class="fa-solid fa-bars"></i>
                            <div id="listName">
                                ${list.listName}
                            </div>
                            <i id="trashcan" class="fa-solid fa-trash-can"></i>
                            <div class="listTaskCount"></div>
                        </li>`)
    renderTaskCounts()
}

function renderTaskPage(list){
    $(".taskPage").children().remove();
    $(".taskPage").prepend(`<div class="taskInfo">
                                <h1>${list.listName}</h1>
                            </div>
                            <ul class="tasks">
                                
                            </ul>
                            <div class="addTask">
                                <i class="fa-sharp fa-solid fa-plus"></i>
                                <input type="text" placeholder="Add a Task" id="addTaskInput">
                            </div>`)
                        
    $("#addTaskInput").focus();
}

function renderTask(taskName){
    $(".tasks").append(`<li class="taskItem">
                            <div class="taskBox">
                                <input type="checkbox" class="taskCheckbox">
                                ${taskName}
                            </div>
                        </li>`)
}

function renderTasksOfAList(index){
    $(".tasks").children().remove();
    for(let t of tasks){
        if(t.key === index){
            renderTask(t.name)
        }
    }
    renderCompletedTasksOfAList(index)
}

function renderCompletedTasksOfAList(index){
    let cnt = 0;
    for(let t = 0; t < tasks.length; t++){
        if(tasks[t].key === index){
           if(tasks[t].completed == 1){
            $(".tasks > li").eq(cnt).addClass("lineThrough")
                             .children().children().attr("checked", true)
           }
           cnt++;
        }
    }
}

function renderTaskCounts(){
    for(let l = 0; l < lists.length; l++){
        $(".lists > li").eq(l).children().last().empty()
        if(lists[l].taskCount == 0){
            $(".lists > li").eq(l).children().last().css("visibility", "hidden")
        } else {
            $(".lists > li").eq(l).children().last().css("visibility", "visible")
                                                    .append(`${lists[l].taskCount}`)
        }
    }
}