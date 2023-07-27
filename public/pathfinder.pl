%% graph search on database: connect(PointA,PointB,Distance)
:- module(pathfinder,[path/4]).

connect2(X,Y,L,Visited) :- (connect(X,Y,L) ; connect(Y,X,L)), \+ member(Y,Visited) .

path(X,X,[X],0 ) :- !, true .
path(X,Y,Found,Distance) :- mnewfile, path0(X,Y,Cand,Dist,[X],0),
                            mWriteLine('path2',Cand,Dist),
                            \+ islonger(X,Y,[X],0,Dist),!, Found=Cand,Distance=Dist,
                            mWriteLine('result',Found,Distance) .

path0(X,Y,Found,Distance,Visited, Traveled ) :- connect2(X,Y,L,Visited),
                                                Distance is Traveled + L,
                                                Found = [Y|Visited]
                                                .
path0(X,Y,Found,Distance,Visited, Traveled ) :- connect2(X,Z,L,Visited),
                                                path0(Z,Y,Found,Distance,[Z|Visited], L+Traveled).

islonger(X,Y,Visited,Range,MaxQ) :- connect2(X,Y,L,Visited), T is Range + L, MaxQ > T .
islonger(X,Y,Visited,Range,MaxQ) :- connect2(X,Z,L,Visited), T is Range + L, MaxQ > T,
                                    islonger(Z,Y,[Z|Visited],T,MaxQ).

mnewfile() :- open('found.txt',write,_).

mWriteLine(Prefix,List,Number) :- open('found.txt',append,F),
                                  write(F,Prefix),write(F,":"),
                                  reverse(List, Found),
                                  write(F,Found),write(F,":"),
                                  writeln(F,Number),
                                  close(F).

mWrite(Prefix,Term) :- open('found.txt',append,F),write(F,Prefix) ,
                        mWriteList(Term,F), close(F) .

mWriteList([],Stream) :- writeln(Stream,"").
mWriteList([H|Rest],Stream) :- write(Stream," : "),write(Stream,H),  mWriteList(Rest,Stream) .

mwriteStep(Prefix,X,Y) :-  open('found.txt',append,F),write(F,Prefix),write(F,':'),write(F,X) ,write(F,' -> '),writeln(F,Y).
