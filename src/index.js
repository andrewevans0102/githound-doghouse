export const DOGHOUSE_ASCII = `
                  ( )  ( )
                   ( )  )
                    )  (
                   ||--||
                  /======\\
                 /        \\
                /  /\\  /\\  \\
               /  /__\\/__\\  \\
              /              \\
             /    DOGHOUSE    \\
            /__________________\\
            |   ____________   |
            |  |  HARVEY'S  |  |
            |  |____🐾______|  |
            |                  |
            |      .----.      |
            |     /      \\     |
            |    |   🐾   |    |
            |    |        |    |
            |____|________|____|
          ========================
`;

export function printDoghouse() {
  console.log(DOGHOUSE_ASCII);
}

// Print when run directly
if (process.argv[1] && process.argv[1].endsWith("index.js")) {
  printDoghouse();
}
