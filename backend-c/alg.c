#include "alg.h"
#include <stdlib.h>

static void swap_int(int *a, int *b){int t=*a;*a=*b;*b=t;}

int colorize(int n, int *starts, int *ends, int *colors_out) {
	if (n <= 0) return 0;
	// indices for sorting by start time
	int *idx = (int*)malloc(sizeof(int)*n);
	if (!idx) return -1;
	for (int i=0;i<n;i++){ idx[i]=i; colors_out[i]=-1; }
	// simple selection sort (n small); for large n, replace with qsort
	for (int i=0;i<n;i++){
		int best=i;
		for (int j=i+1;j<n;j++) if (starts[idx[j]] < starts[idx[best]]) best=j;
		swap_int(&idx[i], &idx[best]);
	}
	int color=0;
	for (int ii=0; ii<n; ii++){
		int v=idx[ii];
		if (colors_out[v] != -1) continue;
		colors_out[v]=color;
		for (int jj=0; jj<n; jj++){
			int u=idx[jj];
			if (colors_out[u] != -1) continue;
			// not overlap: [starts[u], ends[u]) with any colored w in this color
			int ok=1;
			for (int k=0;k<n;k++) if (colors_out[k]==color) {
				int a1=starts[u], b1=ends[u];
				int a2=starts[k], b2=ends[k];
				if (a1 < b2 && a2 < b1) { ok=0; break; }
			}
			if (ok) colors_out[u]=color;
		}
		color++;
	}
	free(idx);
	return color;
}


