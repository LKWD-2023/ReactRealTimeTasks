using Microsoft.AspNetCore.SignalR;
using RealTimeTasks.Data;

namespace ReactRealTimeTasks.Web
{
    public class TasksHub : Hub
    {
        private readonly string _connectionString;

        public TasksHub(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("ConStr");
        }

        public void NewTask(string title)
        {
            var taskRepo = new TasksRepository(_connectionString);
            var task = new TaskItem { Title = title, IsCompleted = false };
            taskRepo.AddTask(task);
            SendTasks();
        }

        private void SendTasks()
        {
            var taskRepo = new TasksRepository(_connectionString);
            var tasks = taskRepo.GetActiveTasks();

            Clients.All.SendAsync("RenderTasks", tasks.Select(t => new
            {
                Id = t.Id,
                Title = t.Title,
                HandledBy = t.HandledBy,
                UserDoingIt = t.User != null ? $"{t.User.FirstName} {t.User.LastName}" : null,
            }));
        }

        public void LogStuff(string s)
        {
            Console.WriteLine(s);
        }

        public void GetAll()
        {
            SendTasks();
        }

        public void SetDoing(int taskId)
        {
            var userRepo = new UserRepository(_connectionString);
            var user = userRepo.GetByEmail(Context.User.Identity.Name);
            var taskRepo = new TasksRepository(_connectionString);
            taskRepo.SetDoing(taskId, user.Id);
            SendTasks();
        }

        public void SetDone(int taskId)
        {
            var taskRepo = new TasksRepository(_connectionString);
            taskRepo.SetCompleted(taskId);
            SendTasks();
        }

    }
}
