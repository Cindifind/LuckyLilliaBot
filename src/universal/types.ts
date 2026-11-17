import type { Event } from '@satorijs/protocol'
import type { ObjectToSnake } from 'ts-case-convert'

export type SatoriEvent = ObjectToSnake<Event>
