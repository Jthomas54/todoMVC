(function (ko) {
    var ui = {
        //Model will inherit everything from the default model
        model: {},
        
        TaskModel: function (name, done) {
            this.name = name || 'WHAT AM I SUPPOSED TO DO!!!!';
            this.done = ko.observable(done);
        },
        
        TodoViewModel: function (tasks) {
            this.currentTask = ko.observable();

            this.tasks = ko.observableArray(tasks.map(function (d) { return new ui.TaskModel(d.name, d.done); })),

            this.addTask = function () {
                if (this.currentTask()) {
                    this.tasks.push(new ui.TaskModel(this.currentTask().trim(), false));
                    
                    this.currentTask('');
                }
            },

            this.popTask = function (task) {
                this.tasks.remove(task);
            }.bind(this),

            this._saveChanges = function () {
                localStorage.setItem('todo', ko.toJSON(this.tasks));
            };
            
            //internally used to save changes when updates happen to the vm and only happen every 500 ms
            ko.computed(function () {
                this._saveChanges();
            }, this).extend({ rateLimit: 500 });
        },
        
        init: function () {
            this.model = new this.TodoViewModel(this._loadTasksFromLocalStorage());
            
            //Not interested in binding to specific element
            ko.applyBindings(this.model);
        },
        
        _loadTasksFromLocalStorage: function () {
            var localCopy = localStorage.getItem('todo');
            
            if (localCopy) {
                return ko.utils.parseJson(localCopy);
            }
            
            return [];
        }
    };
    
    ui.init();
})(window.ko);