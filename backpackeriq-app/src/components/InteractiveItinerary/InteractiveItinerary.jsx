import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import './InteractiveItinerary.css';

export default function InteractiveItinerary({ initialData, destination, budget, travelers, onItineraryUpdate }) {
  const [itinerary, setItinerary] = useState(initialData?.itinerary?.itinerary || []);
  const [regeneratingDayId, setRegeneratingDayId] = useState(null);

  // Sync state if initialData changes externally (e.g. new generation)
  useEffect(() => {
    if (initialData?.itinerary?.itinerary) {
      setItinerary(initialData.itinerary.itinerary);
    }
  }, [initialData]);

  // Handle Drag & Drop
  const handleDragEnd = (result) => {
    if (!result.destination) return;
    
    const newItems = Array.from(itinerary);
    const [reorderedItem] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, reorderedItem);
    
    // Update the 'day' number to reflect new order
    const updatedItems = newItems.map((item, idx) => ({ ...item, day: idx + 1 }));
    setItinerary(updatedItems);
    onItineraryUpdate?.(updatedItems);
  };

  // Regenerate single day
  const handleRegenerateDay = async (dayItem) => {
    setRegeneratingDayId(dayItem.id);
    try {
      const res = await fetch('/api/regenerate-day', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination,
          budget,
          travelers,
          dayIndex: dayItem.day,
          currentItinerary: itinerary
        })
      });
      const data = await res.json();
      if (data.success && data.newDay) {
        const updated = itinerary.map(item => item.id === dayItem.id ? data.newDay : item);
        setItinerary(updated);
        onItineraryUpdate?.(updated);
      } else {
        alert('Failed to regenerate day');
      }
    } catch (e) {
      console.error(e);
      alert('Error regenerating day');
    } finally {
      setRegeneratingDayId(null);
    }
  };

  if (!itinerary || itinerary.length === 0) {
    return <div className="interactive-itin-empty">No structured itinerary available.</div>;
  }

  return (
    <div className="interactive-itin">
      {/* Overview Card */}
      <div className="itin-overview card">
        <div className="itin-overview-header">
          <h3 className="t-display-sm">Trip Overview</h3>
          <div className="itin-overview-cost">
            <span className="itin-cost-label">Est. Total Cost</span>
            <span className="itin-cost-value">{initialData?.itinerary?.summary?.total_cost}</span>
          </div>
        </div>
        
        <div className="itin-overview-body">
          <div className="itin-overview-section">
            <h4 className="itin-section-title">Budget Breakdown</h4>
            <p className="itin-section-text">{initialData?.itinerary?.summary?.breakdown}</p>
          </div>
          <div className="itin-overview-section">
            <h4 className="itin-section-title">How to Reach</h4>
            <p className="itin-section-text">{initialData?.itinerary?.how_to_reach}</p>
          </div>
        </div>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="itinerary-list">
          {(provided) => (
            <div className="itin-days-list" {...provided.droppableProps} ref={provided.innerRef}>
              {itinerary.map((dayItem, index) => (
                <Draggable key={dayItem.id} draggableId={dayItem.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      className={`itin-day-card card ${snapshot.isDragging ? 'is-dragging' : ''}`}
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                    >
                      <div className="itin-day-header">
                        <div className="itin-drag-handle" {...provided.dragHandleProps}>
                          ⋮⋮
                        </div>
                        <div className="itin-day-title-wrap">
                          <span className="itin-day-badge">Day {dayItem.day}</span>
                          <h4 className="itin-day-title t-display-sm">{dayItem.title}</h4>
                        </div>
                        <button 
                          className="btn-ghost btn-sm" 
                          onClick={() => handleRegenerateDay(dayItem)}
                          disabled={regeneratingDayId === dayItem.id}
                        >
                          {regeneratingDayId === dayItem.id ? '🔄 Generating...' : '✨ Regenerate'}
                        </button>
                      </div>

                      <div className="itin-day-activities">
                        <div className="itin-activity">
                          <span className="itin-time-label">Morning</span>
                          <div className="itin-activity-details">
                            <span className="itin-activity-name">{dayItem.morning?.activity}</span>
                            <span className="itin-activity-cost">{dayItem.morning?.cost}</span>
                          </div>
                        </div>
                        <div className="itin-activity">
                          <span className="itin-time-label">Afternoon</span>
                          <div className="itin-activity-details">
                            <span className="itin-activity-name">{dayItem.afternoon?.activity}</span>
                            <span className="itin-activity-cost">{dayItem.afternoon?.cost}</span>
                          </div>
                        </div>
                        <div className="itin-activity">
                          <span className="itin-time-label">Evening</span>
                          <div className="itin-activity-details">
                            <span className="itin-activity-name">{dayItem.evening?.activity}</span>
                            <span className="itin-activity-cost">{dayItem.evening?.cost}</span>
                          </div>
                        </div>
                      </div>

                      <div className="itin-day-logistics">
                        <div className="itin-logistics-item">
                          <span>🏨 Accommodation:</span> {dayItem.accommodation?.name} 
                          <span className="itin-activity-cost ml-2">{dayItem.accommodation?.cost}</span>
                        </div>
                        <div className="itin-logistics-item">
                          <span>🚕 Transport:</span> {dayItem.daily_transport?.mode}
                          <span className="itin-activity-cost ml-2">{dayItem.daily_transport?.cost}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {/* Travel Tips */}
      {initialData?.itinerary?.tips?.length > 0 && (
        <div className="itin-tips card mt-4">
          <h3 className="t-display-sm">Practical Tips</h3>
          <ul className="t-body-sm">
            {initialData.itinerary.tips.map((tip, idx) => (
              <li key={idx}>{tip}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
