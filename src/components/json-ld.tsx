import type { Graph, Thing, WithContext } from 'schema-dts'

/**
 * Structured data as a JSON-LD script. `<` is escaped so content can't close
 * the script tag early.
 */
const JsonLd = ({ data }: { data: Graph | WithContext<Thing> }) => (
    <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{
            __html: JSON.stringify(data).replace(/</g, '\\u003c')
        }}
    />
)

export default JsonLd
