export interface EventStage {
  start?: number;
  end?: number;
  time?: number | string;
  label: string;
  order?: number;
  startsAt?: string | number;
  endsAt?: string | number;
  countdownTitle?: string;
}

export interface EventCategory {
  [stageKey: string]: EventStage;
}

export interface EventTimeline {
  lkti?: EventCategory;
  essay?: EventCategory;
  poster?: EventCategory;
}
