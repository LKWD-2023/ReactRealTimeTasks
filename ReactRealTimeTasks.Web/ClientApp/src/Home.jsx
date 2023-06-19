import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';
import { HubConnectionBuilder } from '@microsoft/signalr';

const Home = () => {
    const { user } = useAuth();
    const [taskText, setTaskText] = useState('');
    const [tasks, setTasks] = useState([]);
    const connectionRef = useRef(null);
    const connection = connectionRef.current;

    useEffect(() => {
        const connectHub = async () => {
            const connection = new HubConnectionBuilder()
                .withUrl("/api/tasksHub").build();

            await connection.start();

            connection.on('RenderTasks', tasks => setTasks(tasks));

            connection.invoke("GetAll");

            connectionRef.current = connection;
        }

        connectHub();
    }, []);

    const onTaskSubmit = async () => {
        await connection.invoke("NewTask", taskText);
        setTaskText('');
    }

    const onDoingItClick = id => {
        connection.invoke("setDoing", id);
    }

    const onDoneClick = id => {
        connection.invoke("setDone", id);
    }

    const getButton = (userId, task) => {
        if (task.handledBy && task.handledBy === userId) {
            return <button className='btn btn-success' onClick={() => onDoneClick(task.id)}>I'm done!</button>;
        }
        if (task.handledBy) {
            return <button className='btn btn-warning' disabled={true}>{task.userDoingIt} is doing this</button>;
        }

        return <button className='btn btn-dark' onClick={() => onDoingItClick(task.id)}>I'm doing this one!</button>
    }

    return (
        <div style={{marginTop:70}}>
            <div className="row">
                <div className="col-md-10">
                    <input type="text"
                        className="form-control"
                        placeholder="Task Title"
                        value={taskText}
                        onChange={e => setTaskText(e.target.value)} />
                </div>
                <div className="col-md-2">
                    <button className="btn btn-primary w-100" onClick={onTaskSubmit}>Add Task</button>
                </div>
            </div>
            <table className="table table-hover table-striped table-bordered mt-3">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {tasks.map(task => {
                        return <tr key={task.id}>
                            <td>{task.title}</td>
                            <td>
                                {getButton(user.id, task)}
                            </td>
                        </tr>
                    })}
                </tbody>
            </table>
        </div>
    )

}


export default Home;