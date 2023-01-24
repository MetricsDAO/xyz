import type {
  EventsParams,
  SDKResponse,
  SubscriberHandle,
  TracerCreateParams,
  TracerEvent,
  TracerHandle,
} from "./types";

export class Pinekit {
  constructor(private opts: { apiKey: string }) {}

  /**
   * Makes an authenticated request to the Pine API.
   * @returns The response data.
   * @throws An error if the response status is not 200.
   */
  private async request<T>(path: string, options: RequestInit) {
    const res = await fetch(`https://pine.lab3547.xyz/api${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": this.opts.apiKey,
      },
    });
    const json = (await res.json()) as SDKResponse<T>;
    if (json.status === "error") {
      throw new Error(json.error.msg);
    }
    return json.data;
  }

  /**
   * Identify function that returns a TracerHandle.
   */
  public tracer(handle: TracerHandle) {
    return handle;
  }

  /**
   * Creates a tracer.
   */
  public createTracer(tracer: TracerCreateParams) {
    return this.request("/tracers", { method: "post", body: JSON.stringify(tracer) });
  }

  /**
   * Lists all tracers for the current user.
   */
  public listTracers() {
    return this.request<TracerHandle[]>("/tracers", { method: "get" });
  }

  public startTracer(tracer: TracerHandle) {
    return this.request(`/tracers/${tracer.namespace}/versions/${tracer.version}/start`, { method: "post" });
  }

  /**
   * Identify function that returns a SubscriberHandle.
   */
  public subscriber(subscriber: string, tracer: TracerHandle): SubscriberHandle {
    return { tracer, subscriber };
  }

  /**
   * Gets the latest events for a subscriber.
   */
  public getNextEvents(sub: SubscriberHandle, params: EventsParams) {
    const url = `/events/tracers/${sub.tracer.namespace}/versions/${sub.tracer.version}?subscriber=${sub.subscriber}&limit=${params.limit}`;
    return this.request<{ events: TracerEvent[] }>(url, { method: "get" });
  }

  /**
   * Returns a generator that yields new events as they are received.
   * If there are no more events then we poll every 5s until there are more.
   * Will loop indefinitely or until an error occurs.
   *
   * ```ts
   * const subscrber = client.subscriber(tracer, "my-subscriber");
   * for await (const event of client.streamEvents(subscriber, { count: 100 })) {
   *  console.log(event);
   * }
   * ```
   */
  async *streamEvents(subscriber: SubscriberHandle, params: EventsParams) {
    const currentBatch = await this.getNextEvents(subscriber, params);
    let events = currentBatch.events;

    while (true) {
      if (events.length === 0) {
        const newBatch = await this.getNextEvents(subscriber, params);
        events = newBatch.events;
      }

      // if its still empty, wait a bit and try again
      if (events.length === 0) {
        await new Promise((resolve) => setTimeout(resolve, 1000 * 5));
        continue;
      }

      yield events.shift()!;
    }
  }

  /**
   * Saves the current position of the subscriber in the event stream. Usually used within a `streamEvents` loop.
   * ```ts
   * const subscrber = client.subscriber(tracer, "my-subscriber");
   * for await (const event of client.streamEvents(subscriber, { count: 100 })) {
   *  await client.saveCursorAt(event, subscriber);
   * }
   */
  public saveCursorAt(event: TracerEvent, sub: SubscriberHandle) {
    const url = `/events/tracers/${sub.tracer.namespace}/versions/${sub.tracer.version}/commit?subscriber=${sub.subscriber}`;
    return this.request(url, { method: "post" });
  }
}
