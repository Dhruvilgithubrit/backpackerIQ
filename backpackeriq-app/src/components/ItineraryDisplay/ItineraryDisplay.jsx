import ReactMarkdown from 'react-markdown';
import './ItineraryDisplay.css';

export default function ItineraryDisplay({ itineraryText }) {
  if (!itineraryText) {
    return <div className="itin-raw"><pre>No itinerary data found.</pre></div>;
  }

  return (
    <div className="itin-container">
      <div className="itin-markdown-wrap">
        <ReactMarkdown
          components={{
            h3: ({node, ...props}) => <h3 className="itin-h3" {...props} />,
            h4: ({node, ...props}) => <h4 className="itin-h4" {...props} />,
            ul: ({node, ...props}) => <ul className="itin-ul" {...props} />,
            li: ({node, ...props}) => <li className="itin-li" {...props} />,
            p:  ({node, ...props}) => {
              // Highlight Day X: titles if they accidentally get parsed as paragraphs
              if (typeof props.children === 'string' && props.children.match(/^(?:DAY|Day)\s+\d+:/)) {
                return <h4 className="itin-day-title">{props.children}</h4>;
              }
              return <p className="itin-p" {...props} />;
            },
            strong: ({node, ...props}) => <strong className="itin-strong" {...props} />
          }}
        >
          {itineraryText}
        </ReactMarkdown>
      </div>
    </div>
  );
}
