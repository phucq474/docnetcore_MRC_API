import React, { PureComponent } from "react";
import { getLogin } from '../../Utils/Helpler';
import { InputText } from "primereact/inputtext";
import * as signalR from "@microsoft/signalr";
const hubConnection = new signalR.HubConnectionBuilder()
    .withUrl("/chat")
    .configureLogging(signalR.LogLevel.Information)
    .withAutomaticReconnect()
    .build();
class Chat extends PureComponent {
    state = {
        messlist: [],
        ConnectionId: '',
    }
    async  startHub() {
        try {
            await hubConnection.start();
            console.log("SignalR Connected." + hubConnection.connectionId);
        } catch (err) {
            console.log(err);
            setTimeout(err, 5000);
        }
    };
    async onSendMessager(user, message) {
        try {
            await hubConnection.invoke("SendMessage", hubConnection.connectionId, user, message);
        } catch (err) {
            console.error(err);
        }
    }
    async ReceiveMessage() {
        await hubConnection.on("receivemessage", (connectionId, user, message) => {
            if (message === null || message === '')
                return;
            else {
                const container = document.createElement("form");
                const span = document.createElement("p");
                span.textContent = `${user}: ${message}`;
                if (user === this.state.username)
                    span.style = "float: right;padding: 10px;border-radius: 20px;text-align:right;";
                else {
                    span.style = "padding: 10px;border-radius: 20px;"
                }
                container.appendChild(span);
                document.getElementById("messageList").appendChild(container);
            }
        });
    }
    async componentDidMount() {
        let username = await getLogin().username;
        this.setState({ username: username });
        // Starts the SignalR connection
        await this.startHub();
        await this.ReceiveMessage();
        await this.onSendMessager(username, "Welcome Spiral Room");
    }
    Send = async (e) => {
        if (e.keyCode === 13 && e.target.value !== undefined && e.target.value !== null) {
            await this.onSendMessager(this.state.username, e.target.value);
            await this.setState({ message: '' });
        }
    }
    render() {
        return (
            <div className="p-grid">
                <div className="p-col-12 p-md-3 p-sm-12"></div>
                <div className="p-col-12 p-md-6 p-sm-12 p-card" p-card id="messageList"></div>
                <div className="p-col-12 p-md-3 p-sm-12"></div>
                <div className="p-col-12 p-md-3 p-sm-12"></div>
                <div className="p-col-12 p-md-6 p-sm-12 p-card">
                    <InputText value={this.state.message}
                        style={{ paddingLeft: 20, borderRadius: 20, fontSize: 13 }}
                        placeholder="Viết bình luận"
                        onChange={(e) => this.setState({ message: e.target.value })}
                        onKeyUp={(e) => this.Send(e)} />
                </div>
                <div className="p-col-12 p-md-3 p-sm-12"></div>
            </div>
        )
    }
} export default Chat;