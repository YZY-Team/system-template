

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { SystemMenuComponents } from "./page";

export default function SystemMenuLayout() {
  return <DndProvider backend={HTML5Backend}><SystemMenuComponents/></DndProvider>;
}