import React, {useEffect, useRef, useState} from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import "./App.css";

interface IMessage {
	id: number;
	username?: string;
	message?: string;
	event: "message" | "connection";
}

function App() {
	const [message, setMessage] = useState("");
	const [messages, setMessages] = useState<IMessage[]>([]);
	const [connected, setConnected] = useState(false);
	const [username, setUsername] = useState("");
	const ws = useRef<WebSocket | null>(null);

	function connection() {
		if (ws.current) return;
		ws.current = new WebSocket("ws://localhost:5000");
		ws.current.onopen = () => {
			console.log("Connect");
			setConnected(true);

			const user: IMessage = {
				id: Date.now(),
				username: username,
				event: "connection",
			};
			ws.current?.send(JSON.stringify(user));
		};

		ws.current.onmessage = (event) => {
			const messageData = JSON.parse(event.data);
			console.log(messageData);
			setMessages((prev) => {
				return [...prev, messageData];
			});
		};
		ws.current.onclose = () => {
			console.log("Socket закрыт");
		};
		ws.current.onerror = () => {
			console.log("Socket произошла ошибка");
		};
	}

	async function sendMessage() {
		const mess: IMessage = {
			id: Date.now(),
			message: message,
			username: username,
			event: "message",
		};
		if (ws.current) {
			ws.current.send(JSON.stringify(mess));
			setMessage("");
		}
	}
	if (!connected) {
		return (
			<div className="my-4" style={{maxWidth: "50%", margin: "0 auto"}}>
				<div className="input-group">
					<input
						type="text"
						className="form-control"
						value={username}
						onChange={(e) => {
							setUsername(e.target.value);
						}}
						placeholder="Введите имя"
					/>
					<button
						className="btn btn-primary"
						onClick={() => {
							connection();
						}}
					>
						Подключиться
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="container my-4">
			<div className="row">
				<div className="col-12">
					<div className="card">
						<div className="card-header">
							<h5>Чат</h5>
						</div>
						<div className="card-body" style={{height: "40vh", overflowY: "scroll"}}>
							{/* Сообщения */}
							{messages.map((mess) => {
								if (mess.event === "connection") {
									return (
										<div key={mess.id} className={`mb-2 message-connect`}>
											Подключился {mess.username}
										</div>
									);
								} else {
									return (
										<div
											key={mess.id}
											className={`mb-2 ${
												mess.username === username ? "message my-message" : "message"
											}`}
										>
											<strong>{mess.username}:</strong> {mess.message}
										</div>
									);
								}
							})}
						</div>
						<div className="card-footer">
							<div className="input-group">
								<input
									type="text"
									className="form-control"
									value={message}
									onChange={(e) => {
										setMessage(e.target.value);
									}}
									placeholder="Введите сообщение..."
								/>
								<button
									className="btn btn-primary"
									onClick={() => {
										sendMessage();
									}}
								>
									Отправить
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default App;
