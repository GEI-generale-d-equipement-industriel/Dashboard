import { createContext } from "react";

// Lets pages open the mobile filters drawer that AppLayout owns.
const FiltersDrawerContext = createContext({ open: () => {} });

export default FiltersDrawerContext;
