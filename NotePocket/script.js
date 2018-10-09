document.querySelector("#addnote").addEventListener("click",() => {Notepad.addnote()});
window.addEventListener("resize",() => {Notepad.onResize()});

let Notepad =
{
    noteContainer: document.querySelector("#notesContainer"),
    notes: [],

    noteDefaultColor: "white",

   
    colorList: ["red","green","blue","yellow", "white"],


    addnote: function()
    {
        let date = new Date();
        let dateString = date.getDate() + "/" + (date.getMonth()+1) + "/" + date.getFullYear()
        this.notes.push(new Note(false,"","",dateString,false,this.noteDefaultColor));
        console.log(this.notes);
        this.fillColumns();
    },


    saveNotes: function()
    {
        let tmp = [];
        this.notes.forEach(el => {
            tmp.push(el.getData());
        });
        window.localStorage.notes = JSON.stringify(tmp);
    },
    loadNotes: function()
    {
        if(window.localStorage.notes)
        {
            console.log("local storage import")
            notesData = JSON.parse(window.localStorage.notes);
            notesData.forEach(el => {
                this.notes.push(new Note(true,el.title,el.content,el.date,el.pin,el.color));
            });
            this.createNoteColumns();
        }
    },
    nCMinSize: 250,
    nColumns: [],
    createNoteColumns: function()
    {        
        while(this.noteContainer.firstChild)
            this.noteContainer.removeChild(this.noteContainer.firstChild);
            this.nColumns = [];

       let cNumber = parseInt(this.noteContainer.offsetWidth / this.nCMinSize);
       console.log(cNumber)

       let cSize = 100 / cNumber;
       console.log(cSize)

       for(let i = 0;i < cNumber;i++)
       {
           let newColumn = document.createElement("div");
           newColumn.classList.add("noteColumn");
           newColumn.style.width = cSize + "%";           
           this.noteContainer.appendChild(newColumn);
           this.nColumns.push(newColumn);
       }

       this.fillColumns();
    },
    resizeNoteColumns: function()
    {
    },
    fillColumns: function()
    {
        console.log("fillingColumns")
        this.nColumns.forEach((el) => {
            while(el.firstChild)
                el.removeChild(el.firstChild);
        });

        let lowestColumn = () => 
        {
            let minIndex = 0;
            let minHeight = this.nColumns[0].offsetHeight;

            for(let i = 1;i < this.nColumns.length;i++)
            {
                minIndex = this.nColumns[i].offsetHeight <= minHeight ? i : minIndex;
            }

            return minIndex;
        }


        this.notes.forEach((note) => {

            if(!note.pin)
                this.nColumns[lowestColumn()].appendChild(note.element);
        });

        this.notes.forEach((note) =>{
            if(note.pin)
                this.nColumns[lowestColumn()].appendChild(note.element);
        });

    },
    onResize: function()
    {        
       let cNumber = parseInt(this.noteContainer.offsetWidth / this.nCMinSize);
       console.log(cNumber,this.nColumns.length)
       if(cNumber != this.nColumns.length)
            this.createNoteColumns();
    }
}


let Note = function(importing,title,content,date,pin,color)
{
    this.isFocused = false;
    this.isMouseOver = true;

    this.pin = pin;
    this.color = color;
    
    this.element = document.createElement("div");
    this.element.classList.add("note");
    this.element.classList.add(this.color);
    setTimeout(() => {
        this.element.style.transform = "scale(1)";
    },100);

    this.element.addEventListener("mouseover",() => {this.onMouseover()});
    this.element.addEventListener("mouseout",() => {this.onMouseOut()});

        this.titleBar = document.createElement("div");
        this.titleBar.classList.add("titleBar");

            this.title = document.createElement("div");
            this.title.classList.add("nTitle");

            this.title.contentEditable = true;

            this.title.addEventListener('focus',(e) => {this.onEdit(e)});            
            this.title.addEventListener('blur',() => {this.onFocusOut()});
        
        this.titleBar.appendChild(this.title);
    
    this.element.appendChild(this.titleBar);

        this.content = document.createElement("div");
        this.content.classList.add("noteContent");

        this.content.contentEditable = true;

        this.content.addEventListener('focus',(e) => {this.onEdit(e)})
        this.content.addEventListener('blur',() => {this.onFocusOut()});

    this.element.appendChild(this.content);

        this.noteDate = document.createElement("div");
        this.noteDate.classList.add("ndate");

        this.noteDate.innerHTML = date;
    this.element.appendChild(this.noteDate);

        this.optionsBar = document.createElement("div");
        this.optionsBar.classList.add("optionsBar");


            this.pinElement = document.createElement("div");
            this.pinElement.classList.add("fa","fa-thumb-tack","opBtn","pin");
            if(this.pin) this.pinElement.classList.add("active");
            this.pinElement.addEventListener("click",() => {this.pinUnpin()});

        this.optionsBar.appendChild(this.pinElement);

            this.colorElement = document.createElement("div");
            this.colorElement.classList.add("opBtn","color",this.color);
            this.colorElement.innerHTML = " ";
            this.colorMenu = document.createElement("div");
            this.colorMenu.classList.add("colorMenu");
            this.colorElement.appendChild(this.colorMenu);
            this.setColorMenu();
        this.optionsBar.appendChild(this.colorElement);

            this.removeBtn = document.createElement("div");
            this.removeBtn.classList.add("opBtn");
            this.removeBtn.innerHTML = "X";
            this.removeBtn.addEventListener("click",() => {this.delete()});
        this.optionsBar.appendChild(this.removeBtn);


    this.element.appendChild(this.optionsBar);

    this.title.innerHTML = title;
    this.content.innerHTML = content;


    if(!importing) this.showEditableOptions();
}

Note.prototype.onMouseover = function()
{    
    if(!this.isMouseOver)
        this.showEditableOptions();
    this.isMouseOver = true;
}

Note.prototype.onMouseOut = function()
{
    this.isMouseOver = false;
    if(!this.isFocused) this.hideEditableOptions();
}

Note.prototype.showEditableOptions = function()
{    
    if(this.content.innerHTML == "" && this.content != document.activeElement) this.content.classList.add("edit");
    if(this.title.innerHTML == "" && this.title != document.activeElement) this.title.classList.add("edit");
    this.optionsBar.classList.add("visible");
}

Note.prototype.hideEditableOptions = function()
{
    this.content.classList.remove("edit");
    this.title.classList.remove("edit");
    this.optionsBar.classList.remove("visible");
}

Note.prototype.onEdit = function(e)
{
    e.target.classList.remove("edit");
    
    this.isFocused = true;
}

Note.prototype.onFocusOut = function(e)
{    
    this.isFocused = false;
    if(!this.isMouseOver) this.hideEditableOptions();
}

Note.prototype.getData = function()
{
    return {
        title: this.title.innerHTML,
        content: this.content.innerHTML,
        date: this.noteDate.innerHTML,
        pin: this.pin,
        color: this.color
    }
}

Note.prototype.pinUnpin = function()
{
    console.log("pinUnpin")
    if(this.pin)
    {
        this.pin = false;
        this.pinElement.classList.remove("active");
    }
    else
    {
        this.pin = true;
        this.pinElement.classList.add("active");
    }

}

Note.prototype.setColorMenu = function()
{
    while(this.colorMenu.firstChild)
    this.colorMenu.removeChild(this.colorMenu.firstChild);

    Notepad.colorList.forEach((el) => {
        if(this.color != el)
        {
            let colorOption = document.createElement("div");
            colorOption.classList.add("colorOption","opBtn",el);
            colorOption.innerHTML = " ";
            this.colorMenu.appendChild(colorOption);
            colorOption.addEventListener("click",() => {this.changeColor(el)});
        }
    });
}

Note.prototype.changeColor = function(newColor)
{
    this.colorElement.classList.remove(this.color);                
    this.element.classList.remove(this.color);
    this.color = newColor;
    this.colorElement.classList.add(this.color);
    this.element.classList.add(this.color);
    this.setColorMenu();
}

Note.prototype.delete = function()
{
    let index = Notepad.notes.indexOf(this);
    Notepad.notes.splice(index,1);
    this.element.parentElement.removeChild(this.element);
    Notepad.fillColumns();
}

Notepad.createNoteColumns();
Notepad.loadNotes();

let saveButton = document.querySelector("#saveNotes");
saveButton.addEventListener("click",Notepad.saveNotes);