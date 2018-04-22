import {
  Callout,
  Card,
  Checkbox,
  Classes,
  Elevation,
  Intent,
  Overlay,
  RangeSlider,
  Tab,
  Tabs } from "@blueprintjs/core";
import { render } from 'react-dom'
import React from 'react'
import {registrationdata} from './registrationdata.js'

export class Multisection extends React.Component {
  render() {
    return (
      <div className="row">
        <div className="twelve columns">
          <h5>Registration Information</h5>
          <p>USE THIS DATA AT YOUR OWN RISK! Classes and preferences change from year to year, so we cannot guarantee that this information will be at all representative of this year.</p>
          <p>This data was collected in Spring 2017. The safe rank listed is the lowest-priority pick where no one reported to us that they hadn't gotten in. For example, out of everyone who filled out the form and got into a class, if everyone who ranked the class 7 got in and some people who ranked a class 8 did not get in, then the safe rank shown below is 7. If no safe rank is listed, then some people who ranked the class 1 did not get in.</p>
          <p>Don't forget about waitlists! These numbers tell you how high people had to rank classes to get in <b>immediately</b>, but waitlists do move a lot.</p>
          <p>Thanks to Lydia Lichlyter for helping with this.</p>
          <table>
            <thead>
              <tr>
                <th>Course</th>
                <th>Professor</th>
                <th>Safe Rank</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Constitutional Law: First Amendment</td>
                <td>Feldman</td>
                <td></td>
              </tr>
              <tr>
                <td>Evidence</td>
                <td>Whiting</td>
                <td></td>
              </tr>
              <tr>
                <td>Evidence</td>
                <td>Schulman</td>
                <td>1</td>
              </tr>
              <tr>
                <td>Negotiation Workshop (Winter/Spring)</td>
                <td>Mnookin</td>
                <td>1</td>
              </tr>
              <tr>
                <td>Trial Advocacy Workshop (Winter)</td>
                <td>Sullivan</td>
                <td>1</td>
              </tr>
              <tr>
                <td>Corporations</td>
                <td>Fried</td>
                <td>1</td>
              </tr>
              <tr>
                <td>Trial Advocacy Workshop (Fall)</td>
                <td>Sullivan</td>
                <td>2</td>
              </tr>
              <tr>
                <td>Evidence</td>
                <td>Rubin</td>
                <td>2</td>
              </tr>
              <tr>
                <td>Constitutional Law: Separation of Powers, Federalism, and Fourteenth Amendment</td>
                <td>Feldman</td>
                <td>2</td>
              </tr>
              <tr>
                <td>Taxation</td>
                <td>Warren</td>
                <td>2</td>
              </tr>
              <tr>
                <td>Constitutional Law: First Amendment</td>
                <td>Field</td>
                <td>2</td>
              </tr>
              <tr>
                <td>Federal Courts and the Federal System</td>
                <td>Goldsmith</td>
                <td>3</td>
              </tr>
              <tr>
                <td>Corporations</td>
                <td>Ramseyer</td>
                <td>3</td>
              </tr>
              <tr>
                <td>Federal Courts and the Federal System</td>
                <td>Fallon</td>
                <td>4</td>
              </tr>
              <tr>
                <td>Federal Courts and the Federal System</td>
                <td>Field</td>
                <td>4</td>
              </tr>
              <tr>
                <td>Taxation</td>
                <td>Brennan</td>
                <td>4</td>
              </tr>
              <tr>
                <td>Corporations</td>
                <td>Clark</td>
                <td>4</td>
              </tr>
              <tr>
                <td>Constitutional Law: Separation of Powers, Federalism, and Fourteenth Amendment</td>
                <td>Lessig</td>
                <td>5</td>
              </tr>
              <tr>
                <td>Taxation</td>
                <td>Desai</td>
                <td>5</td>
              </tr>
              <tr>
                <td>Constitutional Law: First Amendment</td>
                <td>Fried</td>
                <td>6+</td>
              </tr>
              <tr>
                <td>Evidence</td>
                <td>Murray</td>
                <td>6+</td>
              </tr>
              <tr>
                <td>Corporations</td>
                <td>Kraakman</td>
                <td>6+</td>
              </tr>
              <tr>
                <td>Corporations</td>
                <td>Spamann</td>
                <td>6+</td>
              </tr>
              <tr>
                <td>Corporations</td>
                <td>Coates</td>
                <td>6+</td>
              </tr>
              <tr>
                <td>Taxation</td>
                <td>Abrams</td>
                <td>6+</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    )
  }
}

export class Electives extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      term: {
        fall: true,
        fallspring: true
      },
      credits: [1, 5],
      classSize: [0, 100],
      classSizeNA: true,
      permission: true,
      classdays: {
        M: true,
        Tu: true,
        W: true,
        Th: true,
        F: true
      },
      classtime: [8, 21],
      exam: {
        ADTH: true,
        LCTH: true,
        ODTH: true,
        IC: true,
        none: true
      },
      coursetype: {
        course: true,
        readinggroup: true,
        seminar: true
      },
      areas: {
        bu: true,
        co: true,
        cr: true,
        di: true,
        em: true,
        en: true,
        fa: true,
        go: true,
        he: true,
        hu: true,
        ip: true,
        ic: true,
        lpt: true,
        lh: true,
        lp: true,
        pr: true,
        re: true,
        ta: true,
        exp: true,
        pro: true
      },
      overlayOpen: false,
      currProf: "",
      currProfReviews: []
    }
  }

  render() {
    return (
      <div>
        <div className="eight columns electivesVertTab">
          {registrationdata.map(c => {
            // filter
            if (this.state.term.fall !== true && c.term === "FA") return null;
            if (this.state.term.fallspring !== true && c.term === "FS") return null;
            if (this.state.credits[0] > parseInt(c.credits) || parseInt(c.credits) > this.state.credits[1]) return null;
            if (c.classsize !== '' && this.state.classSize[0] > parseInt(c.classsize) || parseInt(c.classsize) > this.state.classSize[1]) return null;
            if (this.state.classSizeNA !== true && c.classsize === '') return null;
            if (this.state.permission !== true && c.byperm === true) return null;
            if (this.state.classdays.M !== true && c.days[0] === true) return null;
            if (this.state.classdays.Tu !== true && c.days[1] === true) return null;
            if (this.state.classdays.W !== true && c.days[2] === true) return null;
            if (this.state.classdays.Th !== true && c.days[3] === true) return null;
            if (this.state.classdays.F !== true && c.days[4] === true) return null;
            let classtime0 = `${this.state.classtime[0]}:00`;
            if (classtime0.length === 4) classtime0 = '0' + classtime0;
            let classtime1 = `${this.state.classtime[1]}:00`;
            if (classtime1.length === 4) classtime1 = '0' + classtime1;
            if (classtime0 > c.starttime || c.endtime > classtime1) return null;
            if (this.state.exam.ADTH !== true && c.examtype === "ADTH") return null;
            if (this.state.exam.LCTH !== true && c.examtype === "LCTH") return null;
            if (this.state.exam.ODTH !== true && c.examtype === "ODTH") return null;
            if (this.state.exam.IC !== true && c.examtype === "IC") return null;
            if (this.state.exam.none !== true && c.examtype === "None") return null;
            if (this.state.coursetype.course !== true && c.coursetype === "Course") return null;
            if (this.state.coursetype.readinggroup !== true && c.coursetype === "Reading Group") return null;
            if (this.state.coursetype.seminar !== true && c.coursetype === "Seminar") return null;
            if (!((this.state.areas.bu === true && c.areas[0] === true) || (this.state.areas.co === true && c.areas[1] === true) || (this.state.areas.cr === true && c.areas[2] === true) || (this.state.areas.di === true && c.areas[3] === true) || (this.state.areas.em === true && c.areas[4] === true) ||  (this.state.areas.en === true && c.areas[5] === true) || (this.state.areas.fa === true && c.areas[6] === true) || (this.state.areas.go === true && c.areas[7] === true) ||  (this.state.areas.he === true && c.areas[8] === true) ||  (this.state.areas.hu === true && c.areas[9] === true) ||  (this.state.areas.ip === true && c.areas[10] === true) || (this.state.areas.ic === true && c.areas[11] === true) || (this.state.areas.lpt === true && c.areas[12] === true) || (this.state.areas.lh === true && c.areas[13] === true) || (this.state.areas.lp === true && c.areas[14] === true) || (this.state.areas.pr === true && c.areas[15] === true) || (this.state.areas.re === true && c.areas[16] === true) || (this.state.areas.ta === true && c.areas[17] === true) || (this.state.areas.exp === true && c.exp === true) || (this.state.areas.pro === true && c.pr === true))) return null;

            let link = `https://hls.harvard.edu/academics/curriculum/catalog/default.aspx?o=${c.link}`
            let classdays = ''
            if (c.days[0]) classdays += 'M '
            if (c.days[1]) classdays += 'Tu '
            if (c.days[2]) classdays += 'W '
            if (c.days[3]) classdays += 'Th '
            if (c.days[4]) classdays += 'F '

            return (
              <Card key={c.link} elevation={Elevation.TWO} style={{margin: 10}}>
                <a href={link} target="_blank"><h5 style={{color: "#1EAEDB"}}>{c.course}</h5></a>
                {c.prereq && <Callout intent={Intent.WARNING}>This class has prerequisite(s).</Callout>}
                {c.byperm && <Callout intent={Intent.WARNING}>This class is by permission only.</Callout>}
                <p>{c.coursetype} by&nbsp;
                  <span
                    tabIndex={0}
                    onKeyPress={(e) => {
                      if (e.which == 13) {
                        e.target.click();
                      }
                    }}
                    onClick={() => {
                      let result = ""
                      $.ajax({
                        url: '/searchDopeComments',
                        type: 'GET',
                        dataType: 'json',
                        data: {
                          course: "",
                          professor: c.professor.toLowerCase(),
                          format: "json"
                        },
                        complete: function(data) {
                          result = JSON.parse(data.responseText);
                          if (result.length == 0) result = [{"comments": "None found."}]
                          this.setState({overlayOpen: true, currProf: c.professor, currProfReviews: result})
                        }.bind(this),
                        error: function(status, jqXHR, error) {
                          this.setState({overlayOpen: true, currProf: c.professor, currProfReviews: [{"comments": "None found."}]})
                        }.bind(this)
                      });
                    }}
                    style={{color: "#1EAEDB", textDecoration: "underline", cursor: "pointer"}}>
                    {c.professor}
                  </span></p>
                {c.profrating != "" && <p>
                  Most recent course rating: <b>{c.courserating}</b> (Percentile: <b>{c.coursepercentile}</b>) |
                  Most recent professor rating: <b>{c.profrating}</b> (Percentile: <b>{c.profpercentile}</b>) |
                  Most recent hours spent per week: <b>{c.hours}</b>
                </p>}
                <p>
                  Number of outlines on toodope: <b>{c.numoutlines}</b> |
                  Number of exams on toodope: <b>{c.numexams}</b>
                </p>
                <p>
                  Class size: <b>{(c.classsize === "") ? "Unknown" : c.classsize}</b> |
                  Credits: <b>{c.credits}</b> |
                  Class days: <b>{classdays}</b> |
                  Class time: <b>{c.starttime} - {c.endtime}</b>
                </p>
              </Card>
            )
          })}
          <Overlay isOpen={this.state.overlayOpen} className={Classes.OVERLAY_SCROLL_CONTAINER} onClose={() => this.setState({overlayOpen: false})}>
            <Card elevation={Elevation.THREE} style={{width: "60vw", left: "calc(50% - 30vw)", top: "20%", height: "60vh", overflowY: "scroll"}}>
              <h5>Professor Reviews: {this.state.currProf}</h5>
              <p>(toodope reviews from all classes this professor has taught.)</p>
              <div>
                {this.state.currProfReviews.map((item, index) => <p key={index}>{item.comments}</p>)}
              </div>
            </Card>
          </Overlay>
        </div>
        <Callout intent={Intent.NONE} className="four columns electivesVertTab">
          <h5>Semester</h5>
          <Checkbox label="Fall" checked={this.state.term.fall} onClick={() => this.setState((prevState, props) => {
            return {term: {fall: !prevState.term.fall, fallspring: prevState.term.fallspring}}
          })}/>
          <Checkbox label="Fall-Spring" checked={this.state.term.fallspring} onClick={() => this.setState((prevState, props) => {
            return {term: {fall: prevState.term.fall, fallspring: !prevState.term.fallspring}}
          })}/>
          <h5>Credits</h5>
          <RangeSlider
            min={1}
            max={5}
            stepSize={1}
            labelStepSize={1}
            onChange={(newrange) => this.setState({credits: newrange})}
            value={this.state.credits}
          />
          <h5>Class Size</h5>
          <RangeSlider
            min={0}
            max={100}
            stepSize={10}
            labelStepSize={20}
            onChange={(newrange) => this.setState({classSize: newrange})}
            value={this.state.classSize}
          />
          <Checkbox label="Include classes for which class size information is not available" checked={this.state.classSizeNA} onClick={() => this.setState((prevState, props) => {
            return {classSizeNA: !prevState.classSizeNA}
          })}/>
          <h5>Permission</h5>
          <Checkbox label="Include by permission classes" checked={this.state.permission} onClick={() => this.setState((prevState, props) => {
            return {permission: !prevState.permission}
          })}/>
          <h5>Class Time</h5>
          <Checkbox label="M" checked={this.state.classdays.M} inline={true} onClick={() => this.setState((prevState, props) => {
            return {classdays: {
              ...prevState.classdays,
              M: !prevState.classdays.M
            }}
          })}/>
          <Checkbox label="Tu" checked={this.state.classdays.Tu} inline={true} onClick={() => this.setState((prevState, props) => {
            return {classdays: {
              ...prevState.classdays,
              Tu: !prevState.classdays.Tu
            }}
          })}/>
          <Checkbox label="W" checked={this.state.classdays.W} inline={true} onClick={() => this.setState((prevState, props) => {
            return {classdays: {
              ...prevState.classdays,
              W: !prevState.classdays.W
            }}
          })}/>
          <Checkbox label="Th" checked={this.state.classdays.Th} inline={true} onClick={() => this.setState((prevState, props) => {
            return {classdays: {
              ...prevState.classdays,
              Th: !prevState.classdays.Th
            }}
          })}/>
          <Checkbox label="F" checked={this.state.classdays.F} inline={true} onClick={() => this.setState((prevState, props) => {
            return {classdays: {
              ...prevState.classdays,
              F: !prevState.classdays.F
            }}
          })}/>
          <RangeSlider
            min={8}
            max={21}
            stepSize={1}
            labelStepSize={13}
            onChange={(newrange) => this.setState({classtime: newrange})}
            value={this.state.classtime}
            labelRenderer={(value) => `${value}:00`}
          />
          <h5>Type of exam</h5>
          <Checkbox label="Any-day take home" checked={this.state.exam.ADTH} onClick={() => this.setState((prevState, props) => {
            return {exam: {
              ...prevState.exam,
              ADTH: !prevState.exam.ADTH
            }}
          })}/>
          <Checkbox label="Last-class take home" checked={this.state.exam.LCTH} onClick={() => this.setState((prevState, props) => {
            return {exam: {
              ...prevState.exam,
              LCTH: !prevState.exam.LCTH
            }}
          })}/>
          <Checkbox label="One-day take home" checked={this.state.exam.ODTH} onClick={() => this.setState((prevState, props) => {
            return {exam: {
              ...prevState.exam,
              ODTH: !prevState.exam.ODTH
            }}
          })}/>
          <Checkbox label="In class" checked={this.state.exam.IC} onClick={() => this.setState((prevState, props) => {
            return {exam: {
              ...prevState.exam,
              IC: !prevState.exam.IC
            }}
          })}/>
          <Checkbox label="None" checked={this.state.exam.none} onClick={() => this.setState((prevState, props) => {
            return {exam: {
              ...prevState.exam,
              none: !prevState.exam.none
            }}
          })}/>
          <h5>Course Type</h5>
          <Checkbox label="Course" checked={this.state.coursetype.course} onClick={() => this.setState((prevState, props) => {
            return {coursetype: {
              ...prevState.coursetype,
              course: !prevState.coursetype.course
            }}
          })}/>
          <Checkbox label="Reading Group" checked={this.state.coursetype.readinggroup} onClick={() => this.setState((prevState, props) => {
            return {coursetype: {
              ...prevState.coursetype,
              readinggroup: !prevState.coursetype.readinggroup
            }}
          })}/>
          <Checkbox label="Seminar" checked={this.state.coursetype.seminar} onClick={() => this.setState((prevState, props) => {
            return {coursetype: {
              ...prevState.coursetype,
              seminar: !prevState.coursetype.seminar
            }}
          })}/>
          <h5>Subject Areas</h5>
          <Checkbox label="Business Organization, Commercial Law, and Finance" checked={this.state.areas.bu} onClick={() => this.setState((prevState, props) => {
            return {areas: {
              ...prevState.areas,
              bu: !prevState.areas.bu
            }}
          })}/>
          <Checkbox label="Constitutional Law & Civil Rights" checked={this.state.areas.co} onClick={() => this.setState((prevState, props) => {
            return {areas: {
              ...prevState.areas,
              co: !prevState.areas.co
            }}
          })}/>
          <Checkbox label="Criminal Law & Procedure" checked={this.state.areas.cr} onClick={() => this.setState((prevState, props) => {
            return {areas: {
              ...prevState.areas,
              cr: !prevState.areas.cr
            }}
          })}/>
          <Checkbox label="Disciplinary Perspectives & Law" checked={this.state.areas.di} onClick={() => this.setState((prevState, props) => {
            return {areas: {
              ...prevState.areas,
              di: !prevState.areas.di
            }}
          })}/>
          <Checkbox label="Employment & Labor Law" checked={this.state.areas.em} onClick={() => this.setState((prevState, props) => {
            return {areas: {
              ...prevState.areas,
              em: !prevState.areas.em
            }}
          })}/>
          <Checkbox label="Environmental Law" checked={this.state.areas.en} onClick={() => this.setState((prevState, props) => {
            return {areas: {
              ...prevState.areas,
              en: !prevState.areas.en
            }}
          })}/>
          <Checkbox label="Family, Gender & Children's Law" checked={this.state.areas.fa} onClick={() => this.setState((prevState, props) => {
            return {areas: {
              ...prevState.areas,
              fa: !prevState.areas.fa
            }}
          })}/>
          <Checkbox label="Government Structure & Function" checked={this.state.areas.go} onClick={() => this.setState((prevState, props) => {
            return {areas: {
              ...prevState.areas,
              go: !prevState.areas.go
            }}
          })}/>
          <Checkbox label="Health Law" checked={this.state.areas.he} onClick={() => this.setState((prevState, props) => {
            return {areas: {
              ...prevState.areas,
              he: !prevState.areas.he
            }}
          })}/>
          <Checkbox label="Human Rights" checked={this.state.areas.hu} onClick={() => this.setState((prevState, props) => {
            return {areas: {
              ...prevState.areas,
              hu: !prevState.areas.hu
            }}
          })}/>
          <Checkbox label="Intellectual Property, Cyberlaw and Technology, and Arts & Entertainment" checked={this.state.areas.ip} onClick={() => this.setState((prevState, props) => {
            return {areas: {
              ...prevState.areas,
              ip: !prevState.areas.ip
            }}
          })}/>
          <Checkbox label="International, Comparative & Foreign Law" checked={this.state.areas.ic} onClick={() => this.setState((prevState, props) => {
            return {areas: {
              ...prevState.areas,
              ic: !prevState.areas.ic
            }}
          })}/>
          <Checkbox label="Legal & Political Theory" checked={this.state.areas.lpt} onClick={() => this.setState((prevState, props) => {
            return {areas: {
              ...prevState.areas,
              lpt: !prevState.areas.lpt
            }}
          })}/>
          <Checkbox label="Legal History" checked={this.state.areas.lh} onClick={() => this.setState((prevState, props) => {
            return {areas: {
              ...prevState.areas,
              lh: !prevState.areas.lh
            }}
          })}/>
          <Checkbox label="Legal Profession, Legal Ethics & Professional Responsibility" checked={this.state.areas.lp} onClick={() => this.setState((prevState, props) => {
            return {areas: {
              ...prevState.areas,
              lp: !prevState.areas.lp
            }}
          })}/>
          <Checkbox label="Procedure & Practice" checked={this.state.areas.pr} onClick={() => this.setState((prevState, props) => {
            return {areas: {
              ...prevState.areas,
              pr: !prevState.areas.pr
            }}
          })}/>
          <Checkbox label="Regulatory Law" checked={this.state.areas.re} onClick={() => this.setState((prevState, props) => {
            return {areas: {
              ...prevState.areas,
              re: !prevState.areas.re
            }}
          })}/>
          <Checkbox label="Taxation" checked={this.state.areas.ta} onClick={() => this.setState((prevState, props) => {
            return {areas: {
              ...prevState.areas,
              ta: !prevState.areas.ta
            }}
          })}/>
          <Checkbox label="Experiential Learning" checked={this.state.areas.exp} onClick={() => this.setState((prevState, props) => {
            return {areas: {
              ...prevState.areas,
              exp: !prevState.areas.exp
            }}
          })}/>
          <Checkbox label="Professional Responsibility" checked={this.state.areas.pro} onClick={() => this.setState((prevState, props) => {
            return {areas: {
              ...prevState.areas,
              pro: !prevState.areas.pro
            }}
          })}/>
        </Callout>
      </div>
    )
  }
}

export class Stats extends React.Component {
  amountToColor = (a) => ({ backgroundColor: `rgba(177, 255, 107, ${a*a/900})` })

  render() {
    return (
      <div style={{ display: "flex", alignItems: "center", flexDirection: "column" }}>
        <table>
          <thead>
            <tr>
              <th>Time</th>
              <th>M</th>
              <th>Tu</th>
              <th>W</th>
              <th>Th</th>
              <th style={{paddingRight: 25}}>F</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Before Noon</td>
              <td style={this.amountToColor(26)}>26</td>
              <td style={this.amountToColor(27)}>27</td>
              <td style={this.amountToColor(15)}>15</td>
              <td style={this.amountToColor(13)}>13</td>
              <td style={this.amountToColor(12)}>12</td>
            </tr>
            <tr>
              <td>Noon - 5pm</td>
              <td style={this.amountToColor(28)}>28</td>
              <td style={this.amountToColor(25)}>25</td>
              <td style={this.amountToColor(30)}>30</td>
              <td style={this.amountToColor(23)}>23</td>
              <td style={this.amountToColor(14)}>14</td>
            </tr>
            <tr>
              <td>After 5pm</td>
              <td style={this.amountToColor(15)}>15</td>
              <td style={this.amountToColor(25)}>25</td>
              <td style={this.amountToColor(23)}>23</td>
              <td style={this.amountToColor(18)}>18</td>
              <td style={this.amountToColor(1)}>1</td>
            </tr>
          </tbody>
        </table>
        <p>Number of classes on each day at each time. If you want days without classes, it would be easiest to have no classes on Thursday and Friday.</p>
        <br /><br />
        <table>
          <thead>
            <tr>
              <th>Type of Exam</th>
              <th>Number of F18 electives</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>None</td>
              <td>83</td>
            </tr>
            <tr>
              <td>In class</td>
              <td>24</td>
            </tr>
            <tr>
              <td>Any-day take home</td>
              <td>17</td>
            </tr>
            <tr>
              <td>Last-class take home</td>
              <td>7</td>
            </tr>
            <tr>
              <td>One-day take home</td>
              <td>6</td>
            </tr>
          </tbody>
        </table>
        <p>Types of exams for F18 electives.</p>
        <br /><br />
        <table>
          <thead>
            <tr>
              <th>Subject Area</th>
              <th>Number of F18 Electives</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Business Organization, Commercial Law, and Finance</td>
              <td>43</td>
            </tr>
            <tr>
              <td>International, Comparative & Foreign Law</td>
              <td>35</td>
            </tr>
            <tr>
              <td>Disciplinary Perspectives & Law</td>
              <td>24</td>
            </tr>
            <tr>
              <td>Government Structure & Function</td>
              <td>24</td>
            </tr>
            <tr>
              <td>Procedure & Practice</td>
              <td>24</td>
            </tr>
            <tr>
              <td>Constitutional Law & Civil Rights</td>
              <td>23</td>
            </tr>
            <tr>
              <td>Legal & Political Theory</td>
              <td>21</td>
            </tr>
            <tr>
              <td>Regulatory Law</td>
              <td>17</td>
            </tr>
            <tr>
              <td>Criminal Law & Procedure</td>
              <td>13</td>
            </tr>
            <tr>
              <td>Legal History</td>
              <td>12</td>
            </tr>
            <tr>
              <td>Human Rights</td>
              <td>11</td>
            </tr>
            <tr>
              <td>Intellectual Property, Cyberlaw and Technology, and Arts & Entertainment</td>
              <td>10</td>
            </tr>
            <tr>
              <td>Health Law</td>
              <td>8</td>
            </tr>
            <tr>
              <td>Family, Gender & Children's Law</td>
              <td>6</td>
            </tr>
            <tr>
              <td>Employment & Labor Law</td>
              <td>4</td>
            </tr>
            <tr>
              <td>Environmental Law</td>
              <td>4</td>
            </tr>
            <tr>
              <td>Legal Profession, Legal Ethics & Professional Responsibility</td>
              <td>3</td>
            </tr>
            <tr>
              <td>Taxation</td>
              <td>3</td>
            </tr>
          </tbody>
        </table>
        <p>Number of electives in each subject area.</p>
      </div>
    )
  }
}

export class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTabId: 'electives',
    };
  }

  handleTabChange = (activeTabId: TabId) => this.setState({ activeTabId });

  render() {
    return (
      <Tabs id="RegistrationTabs" onChange={this.handleTabChange} selectedTabId={this.state.activeTabId}>
        <Tab id="electives" title="Electives" panel={<Electives />} />
        <Tab id="multisection" title="Multisection" panel={<Multisection />} />
        <Tab id="stats" title="Stats" panel={<Stats />} />
      </Tabs>
    )
  }
}



render(<Main />, document.getElementById('main'))
