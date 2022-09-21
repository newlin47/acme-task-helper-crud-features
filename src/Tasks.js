import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import { destroyTask, updateTask, createTask } from './store';

const Tasks = () => {
	const { tasks } = useSelector((state) => state);
	const navigate = useNavigate();
	const [name, setName] = useState('');
	const [complete, setComplete] = useState(false);
	const dispatch = useDispatch();
	const { id } = useParams();
	const { pathname } = useLocation();

	useEffect(() => {
		const task = tasks.find((task) => task.id === id);
		setName(task ? task.name : '');
		setComplete(task ? task.complete : false);
	}, [tasks, id]);

	let filtered = tasks;
	if (pathname === '/easy') {
		filtered = filtered.filter((task) => task.difficulty === 'EASY');
	}
	if (pathname === '/medium') {
		filtered = filtered.filter((task) => task.difficulty === 'MEDIUM');
	}
	if (pathname === '/difficult') {
		filtered = filtered.filter((task) => task.difficulty === 'DIFFICULT');
	}

	const save = (ev) => {
		ev.preventDefault();
		if (id) {
			const task = { id, name, complete };
			dispatch(updateTask(task, navigate));
		} else {
			const task = { name, complete };
			dispatch(createTask(task, navigate));
		}
	};

	const destroy = () => {
		dispatch(destroyTask({ id }, navigate));
	};
	return (
		<div>
			<ul>
				{filtered.map((task) => {
					return (
						<li key={task.id} className={task.complete ? 'complete' : ''}>
							<Link to={`/tasks/${task.id}`}>{task.name}</Link>
							{task.id === id ? task.description : null}
							{task.id === id ? task.difficulty : null}
						</li>
					);
				})}
			</ul>
			<form onSubmit={save}>
				<input
					type='checkbox'
					checked={complete}
					onChange={(ev) => setComplete(ev.target.checked)}
				/>
				<input value={name} onChange={(ev) => setName(ev.target.value)} />
				<button disabled={!name}>Save</button>
			</form>
			{id ? <button onClick={destroy}>x</button> : null}
		</div>
	);
};

export default Tasks;
