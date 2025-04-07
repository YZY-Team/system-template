// 消息框种类
type MessageType = "success" | "error";
// 消息框位置
export enum MessagePosition {
  topLeft = "top-left",
  top = "top",
  topRight = "top-right",
  left = "left",
  center = "center",
  right = "right",
  bottomLeft = "bottom-left",
  bottom = "bottom",
  bottomRight = "bottom-right",
}
// 创建消息框类型
type CreateMessageType = {
  type: MessageType;
  message: string;
  position?: MessagePosition;
};
// 消息框类
class MessageClass {
  private static instance: MessageClass | null = null;
  private modalElement: HTMLSpanElement | null = null;

  private constructor() {
    // 私有构造函数，防止外部实例化
  }

  public static getInstance(): MessageClass {
    if (!MessageClass.instance) {
      MessageClass.instance = new MessageClass();
    }
    return MessageClass.instance;
  }

  private createMessage({ type, message, position }: CreateMessageType) {
    // 如果已经存在弹出框实例，则不再创建
    if (this.modalElement) return;

    // 创建弹出框的内容
    this.modalElement = document.createElement("span");
    this.modalElement.style.all = "unset";
    this.modalElement.style.position = "fixed";
    this.modalElement.style.height = "fit-content";
    this.modalElement.style.display = "flex";
    this.modalElement.style.top = "50%";
    this.modalElement.style.left = "50%";
    this.modalElement.style.transform = "translate(-50%, -50%)";
    this.modalElement.style.padding = "8px 10px 8px 10px";
    this.modalElement.style.borderRadius = "5px";
    this.modalElement.style.width = "fit-content";
    this.modalElement.style.textAlign = "center";
    this.modalElement.style.zIndex = "1000";
    this.modalElement.style.color = "#000";
    this.modalElement.style.fontSize = "14px";
    this.modalElement.style.backgroundColor = "#fff"; // 修改背景颜色为白色
    this.modalElement.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)"; // 添加阴影效果
    // 设置弹出框的位置
    switch (position) {
      case "top-left":
        this.modalElement.style.top = "20px";
        this.modalElement.style.left = "20px";
        break;
      case "top":
        this.modalElement.style.top = "20px";
        this.modalElement.style.left = "50%";
        this.modalElement.style.transform = "translateX(-50%)";
        break;
      case "top-right":
        this.modalElement.style.top = "20px";
        this.modalElement.style.right = "20px";
        break;
      case "left":
        this.modalElement.style.top = "50%";
        this.modalElement.style.left = "20px";
        this.modalElement.style.transform = "translateY(-50%)";
        break;
      case "center":
        this.modalElement.style.top = "50%";
        this.modalElement.style.left = "50%";
        this.modalElement.style.transform = "translate(-50%, -50%)";
        break;
      case "right":
        this.modalElement.style.top = "50%";
        this.modalElement.style.right = "20px";
        this.modalElement.style.transform = "translateY(-50%)";
        break;
      case "bottom-left":
        this.modalElement.style.bottom = "20px";
        this.modalElement.style.left = "20px";
        break;
      case "bottom":
        this.modalElement.style.bottom = "20px";
        this.modalElement.style.left = "50%";
        this.modalElement.style.transform = "translateX(-50%)";
        break;
      case "bottom-right":
        this.modalElement.style.bottom = "20px";
        this.modalElement.style.right = "20px";
        break;
    }
    const checkmark = document.createElement("span");
    // 设置弹出框的背景颜色
    switch (type) {
      case "success":
        checkmark.textContent = "\u2705"; // U+2705字符
        break;
      case "error":
        checkmark.textContent = "\u274C"; // U+274C字符
        break;
    }
    
    checkmark.style.marginRight = "10px"; // 右边距
    this.modalElement.appendChild(checkmark); // 将字符添加到弹出框
    this.modalElement.appendChild(document.createTextNode(message));
    document.body.appendChild(this.modalElement);

    // 设置定时器，2秒后自动关闭弹出框
    setTimeout(() => {
      this.closeModal();
    }, 2000);
  }

  public showModal({
    type,
    message,
    position = MessagePosition.top,
  }: CreateMessageType) {
    this.createMessage({ type, message, position });
  }

  private closeModal() {
    if (this.modalElement) {
      document.body.removeChild(this.modalElement);
      this.modalElement = null; // 清空实例
    }
  }
}

// 导出单例实例
export const message = MessageClass.getInstance();
