#ifndef ALG_H
#define ALG_H

// Welsh–Powell coloring for interval graphs
// n: number of events
// starts[i], ends[i]: minutes from midnight [start, end)
// colors_out[i]: color index result (0..k-1)
// returns number of colors used, or -1 on error
int colorize(int n, int *starts, int *ends, int *colors_out);

#endif // ALG_H


