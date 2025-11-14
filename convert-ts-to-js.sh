#!/bin/bash

# TypeScript to JavaScript Conversion Script for Nocturne-POS Integration

echo "Starting TypeScript to JavaScript conversion..."

# Find all .tsx and .ts files in the NocturnePOS directory
find src/frontend/pages/NocturnePOS -type f \( -name "*.tsx" -o -name "*.ts" \) | while read file; do
    # Determine new filename (.tsx -> .jsx, .ts -> .js)
    if [[ $file == *.tsx ]]; then
        newfile="${file%.tsx}.jsx"
    else
        newfile="${file%.ts}.js"
    fi

    echo "Converting: $file -> $newfile"

    # Perform conversion using sed
    # 1. Remove interface definitions
    # 2. Remove type annotations from function parameters
    # 3. Remove type annotations from variables
    # 4. Remove generic types
    # 5. Fix import statements
    # 6. Remove explicit return types
    sed -E '
        # Remove interface blocks (multi-line)
        /^interface /,/^}/d

        # Remove type definitions
        /^type /d
        /^export type /d
        /^export interface /,/^}/d

        # Remove type annotations from function parameters: (param: Type) -> (param)
        s/\(([a-zA-Z_][a-zA-Z0-9_]*)\s*:\s*[^,)]+/(\1/g
        s/,\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*:\s*[^,)]+/, \1/g

        # Remove return type annotations: ): Type -> )
        s/\)\s*:\s*[^{=>\n]+(\s*[{=>\n])/)\1/g

        # Remove variable type annotations: const x: Type = -> const x =
        s/:\s*[a-zA-Z_<>[\]|&,\s]+(\s*=)/\1/g

        # Remove generic type parameters: <Type> ->
        s/<[a-zA-Z_][a-zA-Z0-9_<>,\s|&]*>//g

        # Fix import extensions: .tsx -> .jsx, .ts -> .js
        s/from\s+"(.*)\.tsx"/from "\1.jsx"/g
        s/from\s+"(.*)\.ts"/from "\1.js"/g
        s/from\s+'\''(.*)\.tsx'\''/from '\''\1.jsx'\''/g
        s/from\s+'\''(.*)\.ts'\''/from '\''\1.js'\''/g

        # Remove "as const"
        s/\s+as\s+const//g

        # Remove React.FC and similar type declarations
        s/:\s*React\.FC[^=]*/=/g
        s/:\s*FC[^=]*/=/g
    ' "$file" > "$newfile"

    # Remove the original TypeScript file
    rm "$file"
done

echo "Conversion complete!"
echo "Total files converted: $(find src/frontend/pages/NocturnePOS -type f \( -name "*.jsx" -o -name "*.js" \) | wc -l)"
