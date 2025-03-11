async function handleChatCompletion(userMessage) {
  const options = {
    method: "POST",
    headers: {
      Authorization:
        "Bearer sk-ojditmuvbrkokzgtmzekrzcirolwnpymgwsreupsikccznmk",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "deepseek-ai/DeepSeek-R1-Distill-Qwen-7B",
      messages: [
        {
          role: "user",
          content: `${userMessage},
        ## 注意：
          只简短得回答我，不用给我思考过程`,
        },
      ],
      stream: false, //是否使用流式响应
      max_tokens: 512, //最大tokens
      stop: null, //停止条件
      temperature: 0.7, //随机性，越高越随机
      top_p: 0.7, //top_p
      top_k: 50, //top_k
      frequency_penalty: 0.5, //频率惩罚越大避免重复
      n: 1,
      response_format: { type: "text" },
    }),
  };

  try {
    const response = await fetch(
      "https://api.siliconflow.cn/v1/chat/completions",
      options
    );
    const data = await response.json(); // 解析响应数据

    const htmlContent = data.choices[0].message.content;
    console.log(htmlContent);
    return htmlContent;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// DOM 元素
const chatMessages = document.getElementById("chat-messages");
const userInput = document.getElementById("user-input");
const sendButton = document.getElementById("send-button");

// 添加消息到聊天界面
function addMessage(content, isUser = false) {
  const messageDiv = document.createElement("div");
  messageDiv.className = `message ${isUser ? "user" : "ai"}`;

  const messageContent = document.createElement("div");
  messageContent.className = "message-content";
  messageContent.textContent = content;

  messageDiv.appendChild(messageContent);
  chatMessages.appendChild(messageDiv);

  // 滚动到最新消息
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// 处理发送消息
async function handleSendMessage() {
  const message = userInput.value.trim();
  if (!message) return;

  // 显示用户消息
  addMessage(message, true);

  // 清空输入框
  userInput.value = "";

  try {
    // 获取AI响应
    const response = await handleChatCompletion(message);
    // 显示AI响应
    addMessage(response);
  } catch (error) {
    addMessage("抱歉，发生了错误，请稍后重试。");
  }
}

// 事件监听
sendButton.addEventListener("click", handleSendMessage);
userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    handleSendMessage();
  }
});
