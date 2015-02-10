(function (ko) {
    var ui = {
        //Model will inherit everything from the default model
        model: {},
        
        TaskModel: function (name, done) {
            this.name = name || '';
            this.done = ko.observable(done);
        },
        
        TodoViewModel: function (tasks) {
            this.currentTask = ko.observable();

            this.tasks = tasks || ko.observableArray([
                new ui.TaskModel('Get Milk', false),
                new ui.TaskModel('Pickup kids', true),
                new ui.TaskModel('Learn ExpressJs', false),
                new ui.TaskModel('Make ExpressJs Todo app with knockout', true)
            ]),
            
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

            if (localCopy != 'undefined') {
                return ko.mapping.fromJSON(localCopy, ui.TaskModel);
            }
            
            return null;
        }
    };
    
    ui.init();
})(window.ko);