import { EventCallback } from "@app/types";

export class EventDispatcher {
  private static listeners: Map<string, Set<EventCallback>> = new Map();

  public static addEventListener(event: string, callback: EventCallback): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);
  }

  public static removeEventListener(event: string, callback: EventCallback): void {
    this.listeners.get(event)?.delete(callback);
  }

  public static dispatch(event: string, detail: unknown): void {
    this.listeners.get(event)?.forEach((callback) => callback(detail));
  }
}
