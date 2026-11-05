import { type KeyboardEvent, useRef } from 'react';
import type { Unit } from '../types/weather';

interface UnitToggleProps {
  unit: Unit;
  onChange: (unit: Unit) => void;
}

/** Alternador de unidade Celsius/Fahrenheit, acessível por teclado. */
export default function UnitToggle({ unit, onChange }: UnitToggleProps) {
  const buttons = useRef<Array<HTMLButtonElement | null>>([null, null]);

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, currentIndex: number) {
    let nextIndex: number;

    switch (event.key) {
      case 'ArrowRight':
        nextIndex = (currentIndex + 1) % 2;
        break;
      case 'ArrowLeft':
        nextIndex = (currentIndex + 1) % 2;
        break;
      case 'Home':
        nextIndex = 0;
        break;
      case 'End':
        nextIndex = 1;
        break;
      default:
        return;
    }

    event.preventDefault();
    buttons.current[nextIndex]?.focus();
    onChange(nextIndex === 0 ? 'celsius' : 'fahrenheit');
  }

  return (
    <div
      role="group"
      aria-label="Unidade de temperatura"
      className="inline-flex rounded-lg border border-white/10 bg-white/5 p-1 backdrop-blur-md"
    >
      <button
        ref={(element) => {
          buttons.current[0] = element;
        }}
        type="button"
        aria-pressed={unit === 'celsius'}
        tabIndex={unit === 'celsius' ? 0 : -1}
        onKeyDown={(event) => handleKeyDown(event, 0)}
        onClick={() => onChange('celsius')}
        className={`rounded-md px-3 py-1 text-sm font-semibold transition ${
          unit === 'celsius' ? 'bg-accent-500 text-white' : 'text-white/60 hover:text-white'
        }`}
      >
        °C
      </button>
      <button
        ref={(element) => {
          buttons.current[1] = element;
        }}
        type="button"
        aria-pressed={unit === 'fahrenheit'}
        tabIndex={unit === 'fahrenheit' ? 0 : -1}
        onKeyDown={(event) => handleKeyDown(event, 1)}
        onClick={() => onChange('fahrenheit')}
        className={`rounded-md px-3 py-1 text-sm font-semibold transition ${
          unit === 'fahrenheit' ? 'bg-accent-500 text-white' : 'text-white/60 hover:text-white'
        }`}
      >
        °F
      </button>
    </div>
  );
}
