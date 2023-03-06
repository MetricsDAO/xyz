import type {
  EventsParams,
  SDKResponse,
  SubscriberHandle,
  TracerConfig,
  TracerDetails,
  TracerEvent,
  TracerHandle,
} from "./types";

export class Client {
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
  public createTracer(tracer: TracerConfig) {
    return this.request("/tracers", { method: "post", body: JSON.stringify(tracer) });
  }

  /**
   * Lists all tracers for the current user.
   */
  public listTracers() {
    return this.request<TracerDetails[]>("/tracers", { method: "get" });
  }

  public async getTracerDetails(tracer: TracerHandle) {
    return this.request<TracerDetails>(`/tracers/${tracer.namespace}/versions/${tracer.version}`, {
      method: "get",
    });
  }

  /**
   * Starts a tracer.
   */
  public startTracer(tracer: TracerHandle) {
    return this.request(`/tracers/${tracer.namespace}/versions/${tracer.version}/start`, { method: "post" });
  }

  /**
   * Cancels a tracer.
   */
  public cancelTracer(tracer: TracerHandle) {
    return this.request(`/tracers/${tracer.namespace}/versions/${tracer.version}/cancel`, { method: "post" });
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
  public async getNextEvents(sub: SubscriberHandle, params: EventsParams) {
    const url = `/events/tracers/${sub.tracer.namespace}/versions/${sub.tracer.version}?subscriber=${sub.subscriber}&limit=${params.limit}`;
    const res = await this.request<{ events: TracerEvent[] } | null>(url, { method: "get" });
    return res ?? { events: [] };
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
      const nextEvent = events.shift()!;
      yield nextEvent;
    }
  }

  /**
   * Saves the current position of the subscriber in the event stream. Usually used within a `streamEvents` loop.
   *
   * @example
   * ```ts
   * const stream = client.streamEvents(subscriber, { count: 10 });
   * for await (const event of events) {
   *  await client.saveCursorAt(event, subscriber);
   * }
   * ```
   */
  public saveCursorAt(event: TracerEvent, sub: SubscriberHandle) {
    const url = `/events/tracers/${sub.tracer.namespace}/versions/${sub.tracer.version}/commit?subscriber=${sub.subscriber}`;
    return this.request(url, {
      method: "post",
      body: JSON.stringify({ blockNumber: event.block.number, eventIndex: event.decoded.index }),
    });
  }
}
