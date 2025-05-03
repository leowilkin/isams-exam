# isams exam parser

## what is this?

isams pupil portal is pretty dire for UX and UI, so I built a better, zero-permission based web app (running either Electron, or as a webapp.)

## how do i run this?

depends who you are:

### i want to use it for my exams

oh sweet :) you can download it from the releases tab (link to follow) and install it. alternatively, you can use [exam-timetable.wilkin.xyz](https://exam-timetable.wilkin.xyz) if you want a web browser version. realistically, I'm going to update the electron app more, but will endevour to keep the webapp up to date.

### i want to hack it/code it

hello friend. you only need to know one command to run this locally!

```bash
npm i && npm start
```

that will install all the required packages, and start the electron app locally on your machine.

if you want to run the webapp, go into 'web', and use your favourite http server. for example, i like python's http.server.

```bash
python -m http.server
```

### i am trying to hack it but i am lost/never had any idea how this jank code works

same. your best bet is chatgpt and coffee. word of warning, chatgpt seems to be absolutely _dreadful_ at electron stuff, so i gave up using it for the electron adaptation and just actually learnt electron in the first place.


## wait... hack? is this safe to use/for my students to use?

yes, absolutely. as this code is all open source, you can see that it actually never calls any services - apart from my analytics to show me some cute stats on how people use this. even though it's branded as iSAMS Exams, it never actually talks directly to isams. The only information it receives is exactly what you paste into it.

## omg leo you're so cool

thanks. if you need help with this, send me an email ~ leo [at] wilkin.xyz

## can I completely steal all your code and call it mine?

no.

## can i steal all your code, but leave attribution to you in it?

yes.


