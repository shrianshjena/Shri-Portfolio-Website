/*
 * Weighted-task progress tracker for the preloader. Each task resolves on
 * completion or on its individual timeout, so a slow asset can never hang the
 * loading gate. Progress is emitted as 0-100.
 */

export interface LoadingTask {
  readonly id: string;
  readonly weight: number;
  readonly run: () => Promise<unknown>;
}

export interface LoadingTracker {
  readonly promise: Promise<void>;
  readonly onProgress: (listener: (progress: number) => void) => () => void;
}

function raceWithTimeout(task: Promise<unknown>, timeoutMs: number): Promise<void> {
  const safeTask = task.then(
    () => undefined,
    () => undefined,
  );
  const timeout = new Promise<void>((resolve) => {
    setTimeout(resolve, timeoutMs);
  });
  return Promise.race([safeTask, timeout]);
}

export function createLoadingTracker(
  tasks: readonly LoadingTask[],
  taskTimeoutMs: number,
): LoadingTracker {
  const totalWeight = tasks.reduce((sum, task) => sum + task.weight, 0);
  const listeners = new Set<(progress: number) => void>();
  let completedWeight = 0;

  const emit = (): void => {
    const progress =
      totalWeight === 0 ? 100 : Math.round((completedWeight / totalWeight) * 100);
    listeners.forEach((listener) => listener(progress));
  };

  const promise = Promise.all(
    tasks.map(async (task) => {
      await raceWithTimeout(task.run(), taskTimeoutMs);
      completedWeight += task.weight;
      emit();
    }),
  ).then(() => undefined);

  return {
    promise,
    onProgress: (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}

/* Standard task builders used by the preloader. */

export function fontsTask(weight: number): LoadingTask {
  return {
    id: "fonts",
    weight,
    run: () => document.fonts.ready,
  };
}

export function imageDecodeTask(id: string, src: string, weight: number): LoadingTask {
  return {
    id,
    weight,
    run: () => {
      const img = new Image();
      img.src = src;
      return img.decode();
    },
  };
}

export function firstFrameTask(weight: number): LoadingTask {
  return {
    id: "first-frame",
    weight,
    run: () =>
      new Promise<void>((resolve) => {
        requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
      }),
  };
}
