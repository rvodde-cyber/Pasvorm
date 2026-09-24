# Referentie-implementatie van de Pasvorm-regelmotor (regie, Claude). Alleen ter controle van testcases.json; niet onderdeel van de app.
# Draaien vanuit src/content: python3 ../../docs/regie/referentie_regelmotor.py
import json
J=lambda n: json.load(open(n,encoding='utf8'))
INS=J('instruments.json')['instruments']; IDX={i['id']:k for k,i in enumerate(INS)}; BY={i['id']:i for i in INS}
BASE=J('baseline.json'); PAIRS=J('pairs.json'); CUL=J('culture.json'); CTX=J('context.json'); MMV=J('mmv.json'); PH=J('phases.json')
ORD={p['id']:p['order'] for p in PH['phases']}; PID={v:k for k,v in ORD.items()}
def req(phase):
    r={}
    for p in sorted(BASE['requirements'],key=lambda x:ORD[x]):
        if ORD[p]<=ORD[phase]: r.update(BASE['requirements'][p])
    return r
def applicable(i,size): return i['minSize']==0 or size>=i['minSize']
def run(inp):
    size=inp['size']; st={i['id']:inp['stages'].get(i['id'],0) for i in INS}
    first,second=inp['phaseChoices']; crisis=inp['crisis']
    cs={s['phaseId']:s['id'] for s in PH['crisisSignals']}
    sig=[]
    transition = ORD[second]==ORD[first]+1 and crisis.get(cs[first],'nee') in ('ja','deels')
    if transition: sig.append('transition')
    if abs(ORD[second]-ORD[first])>1: sig.append('inconsistentPhase')
    prof=inp['culture']; mx=max(prof.values()); dom=[q for q,v in prof.items() if v==mx]
    flat = mx-min(prof.values()) < CUL['flatProfileThreshold']
    if flat: sig.append('flatProfile')
    elif not set(dom)&set(CUL['expectedByPhase'][first]): sig.append('phaseCultureTension')
    wf=next(o for o in CTX['workforce']['options'] if o['id']==inp['workforce'])
    prio=wf['priority']
    def key(i):
        rf=sum(1 for r in BY[i]['reinforces'] if st.get(r,0)>=2)
        return (0 if i in prio else 1, -rf, IDX[i])
    out=[]
    r1=[i['id'] for i in INS if i['legal'] and applicable(i,size) and st[i['id']]<2]
    out+= [(i,'R1') for i in r1]
    used=set(r1)
    r5=[]
    for p in PAIRS['pairs']:
        a,b=st[p['a']],st[p['b']]
        if max(a,b)>0 and abs(a-b)>=PAIRS['gapThreshold']:
            w=p['a'] if a<b else p['b']
            if w not in used and w not in r5: r5.append(w)
    rq=req(first)
    r2=sorted([i for i,v in rq.items() if st[i]<v and i not in used and i not in r5],key=key)
    r2b=[]
    if transition:
        nxt=PID[ORD[first]+1]
        r2b=sorted([i for i,v in BASE['requirements'][nxt].items() if st[i]<v and i not in used and i not in r5 and i not in r2],key=key)
    fill=[(i,'R5') for i in r5]+[(i,'R2') for i in r2]+[(i,'R2b') for i in r2b]
    while len(out)<3 and fill: out.append(fill.pop(0))
    sufficient = not r1 and not r5 and not r2
    # overweight
    for i in INS:
        if i['legal'] or st[i['id']]<3: continue
        firstphase=min([ORD[p] for p,r in BASE['requirements'].items() if i['id'] in r] or [99])
        if firstphase-ORD[first]>=BASE['overweightPhaseDistance'] and firstphase!=99: sig.append('overweight:'+i['id'])
    fut=next(o for o in CTX['future']['options'] if o['id']==inp['future'])
    pr={i for i,_ in out}
    tmp=sorted([i for i in fut['temporarySet'] if applicable(BY[i],size) and st[i]<2 and i not in pr],key=key)[:CTX['future']['maxTemporary']]
    notes=[]
    for m in MMV['items']:
        if inp.get('mmv',{}).get(m['id'],4)<=MMV['lowThreshold']:
            notes.append(m['instrumentId'])
            if st[m['instrumentId']]>=2: sig.append('paperNoPractice:'+m['instrumentId'])
    return dict(priorities=[{'instrumentId':i,'rule':r} for i,r in out],sufficient=sufficient,temporary=tmp,external=fut['external'],
        form=None if flat else dom[0],signals=sig,ethicsNotes=notes)
LEG={k:3 for k in ['personeelsdossier','arbeidsovereenkomsten','verzuimbeleid','avg_privacy','rie','medezeggenschap']}
T4st=dict(LEG,onboarding=2,werkoverleg=2,erkenning=1,functieprofielen=2,werving_selectie=2,gesprekscyclus=2,gedragscode=2,beloning=1,opleiding=1,meldcultuur=1,interne_communicatie=1)
C=lambda c,a,m,h: dict(clan=c,adhocracy=a,market=m,hierarchy=h)
cases=[
 dict(id="T1",name="Taxibedrijf",input=dict(size=400,phaseChoices=["f1","f2"],crisis={"c1":"ja"},culture=C(20,10,20,50),future="gelijk",workforce="uitvoerend",stages=dict(LEG),mmv={})),
 dict(id="T2",name="Schoonmaakbedrijf",input=dict(size=200,phaseChoices=["f2","f3"],crisis={"c2":"nee"},culture=C(15,10,25,50),future="gelijk",workforce="uitvoerend",stages=dict(LEG),mmv={})),
 dict(id="T3",name="Start-up",input=dict(size=12,phaseChoices=["f1","f2"],crisis={"c1":"nee"},culture=C(50,30,10,10),future="groei",workforce="schaars",stages=dict(personeelsdossier=3,arbeidsovereenkomsten=3,verzuimbeleid=2,avg_privacy=2,rie=0,onboarding=1,werkoverleg=1,erkenning=1,personeelsplanning=3),mmv={})),
 dict(id="T4",name="Toereikend",input=dict(size=35,phaseChoices=["f2","f3"],crisis={"c2":"nee"},culture=C(10,10,30,50),future="gelijk",workforce="vakmanschap",stages=dict(T4st),mmv={})),
 dict(id="T5",name="Coherentiehiaat",input=dict(size=35,phaseChoices=["f2","f3"],crisis={"c2":"nee"},culture=C(10,10,30,50),future="gelijk",workforce="vakmanschap",stages=dict(T4st,opleiding=0),mmv={})),
 dict(id="T6",name="Afbouw",input=dict(size=120,phaseChoices=["f4","f5"],crisis={"c4":"nee"},culture=C(10,10,20,60),future="afbouw",workforce="gemengd",stages={i['id']:3 for i in INS},mmv={})),
 dict(id="T7",name="Papier zonder praktijk",input=dict(size=35,phaseChoices=["f2","f3"],crisis={"c2":"nee"},culture=C(10,10,30,50),future="gelijk",workforce="vakmanschap",stages=dict(T4st,meldcultuur=2),mmv={"m4":2})),
 dict(id="T8",name="Tegenstrijdig en vlak",input=dict(size=60,phaseChoices=["f1","f4"],crisis={"c1":"deels"},culture=C(26,25,25,24),future="gelijk",workforce="uitvoerend",stages={},mmv={})),
]
for c in cases:
    c['expected']=run(c['input'])
    e=c['expected']; print(c['id'],[p['instrumentId']+':'+p['rule'] for p in e['priorities']],'suff' if e['sufficient'] else '','tmp',e['temporary'],e['external'],'form',e['form'],e['signals'],e['ethicsNotes'])
json.dump({"version":"1.0","note":"Verwachte uitkomsten, berekend met de referentie-implementatie van de regie. Niet genoemde instrumenten = 0, niet genoemde MMV-items = 4.","cases":cases},open('testcases.json','w',encoding='utf8'),ensure_ascii=False,indent=2)
