using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using Microsoft.EntityFrameworkCore;

namespace RealTimeTasks.Data
{
    public class TasksRepository
    {
        private readonly string _connectionString;

        public TasksRepository(string connectionString)
        {
            _connectionString = connectionString;
        }

        public void AddTask(TaskItem task)
        {
            using var context = new TaskItemsContext(_connectionString);
            context.TaskItems.Add(task);
            context.SaveChanges();
        }

        public List<TaskItem> GetActiveTasks()
        {
            using var context = new TaskItemsContext(_connectionString);
            return context.TaskItems.Include(t => t.User)
                .Where(t => !t.IsCompleted).ToList();
        }

        public void SetDoing(int taskId, int userId)
        {
            using var context = new TaskItemsContext(_connectionString);
            context.Database.ExecuteSqlInterpolated($"UPDATE TaskItems SET HandledBy = {userId} WHERE Id = {taskId}");
        }

        public void SetCompleted(int taskId)
        {
            using var context = new TaskItemsContext(_connectionString);
            context.Database.ExecuteSqlInterpolated($"UPDATE TaskItems SET IsCompleted = 1 WHERE Id = {taskId}");
        }

        public TaskItem GetById(int id)
        {
            using var context = new TaskItemsContext(_connectionString);
            return context.TaskItems.Include(t => t.User).FirstOrDefault(i => i.Id == id);
        }
    }
}