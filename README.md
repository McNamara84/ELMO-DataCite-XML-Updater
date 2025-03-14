# DataCiteMappings
 This tool offers the possibility to upload XML files according to the outdated DataCite schema in version 3.1 and to transform them into XML files according to the current DataCite schema in version 4.6.
## Quickstart
1. Change directory: `cd xml-transformer`
2. Start testserver: `node server.js`
3. Visit `http://localhost:3000/` for testing
## Concordance Table
| **Datacite 3.1** | **Obligation 3.1** | **DataCite 4.6** | **Obligation 4.6** | **note** |
|---|---|---|---|---|
| resource |  | resource |  | Root |
| identifier | M | identifier | M |  |
| identifier=identifierType | M | identifier=identifierType | M |  |
| creators |  | creators |  |  |
| creators>creator | M | creators>creator | M |  |
| creators>creator>creatorName | M | creators>creator>creatorName | M | The personal name format should<br>be: family, given.  |
| / |  | creators>creator>creatorName=nameType |  | cannot be mapped, because information is not given in 3.1  |
| / |  | creators>creator>creatorName=xml:lang |  | cannot be mapped, because information is not given in 3.1 |
|  |  | creators>creator>givenName |  | not mandatory, but could be filled with second part of contributorName. But only for contributor Persons. Since it is not possible, to determine weather nam belongs to a person or organisation in 3.1, this will not be mapped. |
|  |  | creators>creator>familyName |  | not mandatory, but could be filled with second part of contributorName. But only for contributor Persons. Since it is not possible, to determine weather nam belongs to a person or organisation in 3.1, this will not be mapped. |
| creators>creator>nameIdentifier |  | creators>creator>nameIdentifier |  |  |
| creators>creator>nameIdentifier=nameIdentiferScheme | mandatory, if nameIdentifier is given | creators>creator>nameIdentifier=nameIdentiferScheme |  | mandatory, if nameIdentifier is specified |
| creators>creator>nameIdentifier=schemeURI |  | creators>creator>nameIdentifier=schemeURI |  |  |
| creators>creator>affiliation |  | creators>creator>affiliation |  |  |
| / |  | creators>creator>affiliation=affiliationIdentifer |  | cannot be mapped, because information is not given in 3.1 |
| / |  | creators>creator>affiliation=affiliationIdentiferScheme |  | cannot be mapped, because information is not given in 3.1 |
| / |  | creators>creator>affiliation=schemeURI |  | cannot be mapped, because information is not given in 3.1 |
| titles |  | titles |  |  |
| titles>title | M | titles>title | M |  |
| titles>title=titleType |  | titles>title=titleType |  |  |
| titles>title=xml:lang |  | titles>title=xml:lang |  |  |
| publisher | M | publisher | M |  |
| / |  | publisher=publisherIdentifier |  | could be mapped with constant, if publisher is always GFZ Dataservices |
| / |  | publisher=publisherIdentifierScheme | mandatory, if publisherIdentifier is used | could be mapped with constant, if publisher is always GFZ Dataservices |
| / |  | publisher=schemeURI |  | could be mapped with constant, if publisher is always GFZ Dataservices |
| / |  | publisher=xml:lang |  | probably always en? |
| publicationYear | M | publicationYear | M |  |
| subjects |  | subjects |  |  |
| subjects>subject | R | subjects>subject |  |  |
| subjects>subject=subjectScheme |  | subjects>subject=subjectScheme |  |  |
| subjects>subject>schemeURI |  | subjects>subject>schemeURI |  |  |
| / |  | subjects>subject=valueURI |  | cannot be mapped, because information is not given in 3.1 |
| / |  | subjects>subject=classificationCode |  | cannot be mapped, because information is not given in 3.1 |
| subjects>subject>xml:lang |  | subjects>subject>xml:lang |  |  |
| contributors |  | contributors |  |  |
| contributors>contributor | R | contributors>contributor | R |  |
| contributors>contributor=contributorType | If Contributor is used, then contributorType is mandatory. | contributors>contributor=contributorType | If Contributor is used, then contributorType is mandatory. |  |
| contributors>contributor>contributorName | If Contributor is used, then contributorName is mandatory. | contributors>contributor>contributorName | If Contributor is used, then contributorName is mandatory. |  |
|  |  | contributors>contributor>contributorName=nameType |  | cannot be mapped, because information is not given in 3.1 |
|  |  | contributors>contributor>contributorName=xml:lang |  | cannot be mapped, because information is not given in 3.1 |
|  |  | contributors>contributor>givenName |  | not mandatory, but could be filled with second part of contributorName. But only for contributor Persons. Since it is not possible, to determine weather nam belongs to a person or organisation in 3.1, this will not be mapped. |
|  |  | contributors>contributor>familyName |  | not mandatory, but could be filled with second part of contributorName. But only for contributor Persons. Since it is not possible, to determine weather nam belongs to a person or organisation in 3.1, this will not be mapped. |
| contributors>contributor>nameIdentifier |  | contributors>contributor>nameIdentifier |  |  |
| contributors>contributor>nameIdentifier=nameIdentifierScheme | If nameIdentifier is used, nameIdentifierScheme is mandatory. | contributors>contributor>nameIdentifier=nameIdentifierScheme | If nameIdentifier is used, nameIdentifierScheme is mandatory. |  |
| contributors>contributor>nameIdentifier=schemeURI |  | contributors>contributor>nameIdentifier=schemeURI |  |  |
| contributors>contributor>affiliation |  | contributors>contributor>affiliation |  |  |
| / |  | contributors>contributor>affiliation=affiliationIdentifier |  | cannot be mapped, because information is not given in 3.1 |
| / |  | contributors>contributor>affiliation=affiliationIdentifierScheme | If affiliationIdentifier is used, affiliationIdentifierScheme is mandatory. | cannot be mapped, because information is not given in 3.1 |
| / |  | contributors>contributor>affiliation=schemeURI |  | cannot be mapped, because information is not given in 3.1 |
| dates |  | dates |  |  |
| dates>date | R | dates>date | R |  |
| dates>date=dateType | If Date is used, dateType is mandatory. | dates>date=dateType | If Date is used, dateType is mandatory. |  |
| / |  | dates>date=dateInformation |  | cannot be mapped, because information is not given in 3.1 |
| language | O | language | O |  |
| resourceType | R | resourceType | M | became mandatory with version 4.0. will be filled with "Dataset" if resourceType not given in 3.1 |
| resourceType=resourceTypeGeneral | If ResourceType is used,<br>resourceTypeGeneral is<br>mandatory. | resourceType=resourceTypeGeneral | M | occurence 1 (mandatory) since scheme version 4.0,will be set to "Dataset", if not given in 3.1 |
| alternateIdentifiers | O | alternateIdentifiers | O |  |
| alternateIdentifiers>alternateIdentifier | O | alternateIdentifiers>alternateIdentifier | O |  |
| alternateIdentifiers>alternateIdentifier=alternateIdentifierType | If AlternateIdentifier is used,<br>alternateIdentifierType is<br>mandatory | alternateIdentifiers>alternateIdentifier=alternateIdentifierType | If alternateIdentifier is used, alternateIdentifierType is mandatory. |  |
| relatedIdentifiers |  | relatedIdentifiers |  |  |
| relatedIdentifiers>relatedIdentifier | R | relatedIdentifiers>relatedIdentifier | R |  |
| / |  | relatedIdentifiers>relatedIdentifier=resourceTypeGeneral |  | optional attribute since 4.1, cannot be mapped, because information is not given in 3.1 |
| relatedIdentifiers>relatedIdentifier=relatedIdentifierType | If RelatedIdentifier is used,<br>relatedIdentifierType is<br>mandatory. | relatedIdentifiers>relatedIdentifier=relatedIdentifierType | If relatedIdentifier is used, relatedIdentifierType is mandatory. |  |
| relatedIdentifiers>relatedIdentifier=relationType | If RelatedIdentifier is used,<br>relationType is mandatory. | relatedIdentifiers>relatedIdentifier=relationType | If RelatedIdentifier is used, relationType is mandatory. |  |
| relatedIdentifiers>relatedIdentifier=relatedMetadataScheme |  | relatedIdentifiers>relatedIdentifier=relatedMetadataScheme |  |  |
| relatedIdentifiers>relatedIdentifier=schemeURI |  | relatedIdentifiers>relatedIdentifier=schemeURI |  |  |
| relatedIdentifiers>relatedIdentifier=schemeType |  | relatedIdentifiers>relatedIdentifier=schemeType |  |  |
| sizes |  | sizes |  |  |
| sizes>size | O | sizes>size | O |  |
| formats |  | formats |  |  |
| formats>format | O | formats>format | O |  |
| version | O | version | O |  |
| rightsList |  | rightsList |  |  |
| rightsList>rights | O | rightsList>rights | O | Free text in both scheme versions |
| rightsList>rights=rightsURI |  | rightsList>rights=rightsURI |  |  |
| / |  | rightsList>rights=rightsIdentifier |  | cannot be mapped, because information is not given in 3.1 |
| / |  | rightsList>rights=rightsIdentifierScheme |  | cannot be mapped, because information is not given in 3.1 |
| / |  | rightsList>rights=schemeURI |  | cannot be mapped, because information is not given in 3.1 |
| / |  | rightsList>rights=xml:lang |  | cannot be mapped, because information is not given in 3.1 (might always be en?) |
| descriptions |  | descriptions |  |  |
| descriptions>description | R | descriptions>description | R |  |
| descriptions>description=descriptionType | If Description is used,<br>descriptionType is mandatory. | descriptions>description=descriptionType | If Description is used, descriptionType is mandatory. |  |
| descriptions>description=xml:lang |  | descriptions>description=xml:lang |  |  |
| descriptions>description>br |  | descriptions>description>br |  |  |
| geoLocations |  | geoLocations |  |  |
| geoLocations>geoLocation | R | geoLocations>geoLocation | R |  |
| geoLocations>geoLocation>geoLocationPoint |  | geoLocations>geoLocation>geoLocationPoint |  |  |
| geoLocationPoint substring after whitespace |  | geoLocations>geoLocation>geoLocationPoint>pointLongitude | If geoLocationPoint is used, pointLongitude is mandatory. | geoLocationPoint substring after whitespace |
| geoLocationPoint substring before whitespace |  | geoLocations>geoLocation>geoLocationPoint>pointLatitude | If geoLocationPoint is used, pointLatitude is mandatory. | geoLocationPoint substring after whitespace |
| geoLocations>geoLocation>geoLocationBox |  | geoLocations>geoLocation>geoLocationBox |  |  |
| substring of geoLocationBox |  | geoLocations>geoLocation>geoLocationBox>westBoundLongitude | If geoLocationBox is used, westBoundLongitude is mandatory |  |
| substring of geoLocationBox |  | geoLocations>geoLocation>geoLocationBox>eastBoundLongitude | If geoLocationBox is used, eastBoundLongitude is mandatory |  |
| substring of geoLocationBox |  | geoLocations>geoLocation>geoLocationBox>southBoundLatitude | If geoLocationBox is used, southBoundLatitude is mandatory |  |
| substring of geoLocationBox |  | geoLocations>geoLocation>geoLocationBox>northBoundLatitude | If geoLocationBox is used, northBoundLatitude is mandatory |  |
| geoLocations>geoLocation>geoLocationPlace |  | geoLocations>geoLocation>geoLocationPlace |  |  |
| / |  | geoLocations>geoLocation>geoLocationPolygon |  | cannot be mapped, because information is not given in 3.1 |
| / |  | geoLocations>geoLocation>geoLocationPolygon>PolygonPoint |  | cannot be mapped, because information is not given in 3.1 |
| / |  | geoLocations>geoLocation>geoLocationPolygon>PolygonPoint>pointLongitude |  | cannot be mapped, because information is not given in 3.1 |
| / |  | geoLocations>geoLocation>geoLocationPolygon>PolygonPoint>pointLatitude |  | cannot be mapped, because information is not given in 3.1 |
| / |  | geoLocations>geoLocation>geoLocationPolygon>inPolygonPoint |  | cannot be mapped, because information is not given in 3.1 |
| / |  | geoLocations>geoLocation>geoLocationPolygon>inPolygonPoint>pointLongitude |  | cannot be mapped, because information is not given in 3.1 |
| / |  | geoLocations>geoLocation>geoLocationPolygon>inPolygonPoint>pointLatitude |  | cannot be mapped, because information is not given in 3.1 |
|  |  | fundingReferences |  |  |
|  |  | fundingReferences>fundingReference | O |  |
| contributorName IF contributorType="Funder" |  | fundingReferences>fundingReference>funderName | If FundingReference is used, then funderName is mandatory. | Contributor with contributorType "Funder" |
| contributors>contributor>nameIdentifier IF  contributorType="Funder" |  | fundingReferences>fundingReference>funderIdentifier |  | contributor>nameIdentifier IF Type ist Funder |
| contributors>contributor>nameIdentifier=nameIdentifierType IF contributorType="Funder" |  | fundingReferences>fundingReference>funderIdentifier=funderIdentifierType | If funderIdentifier is used, funderIdentifierType is mandatory. | contributor>nameIdentifierType IF Type ist Funder |
| contributors>contributor>nameIdentifier=schemeURI IF contributorType="Funder" |  | fundingReferences>fundingReference>funderIdentifier=schemeURI |  |  IF Type is Funder |
| / |  | fundingReferences>fundingReference>awardNumber |  | cannot be mapped, because information is not given in 3.1 |
| / |  | fundingReferences>fundingReference>awardNumber=awardURI |  | cannot be mapped, because information is not given in 3.1 |
| / |  | fundingReferences>fundingReference>awardTitle |  | cannot be mapped, because information is not given in 3.1 |
| / |  | relatedItems |  | cannot be mapped, because information is not given in 3.1 |
| / |  | relatedItems>relatedItem | O | cannot be mapped, because information is not given in 3.1 |
| / |  | relatedItems>relatedItem=relatedItemType |  | cannot be mapped, because information is not given in 3.1 |
| / |  | relatedItems>relatedItem=relationType |  | cannot be mapped, because information is not given in 3.1 |
| / |  | relatedItems>relatedItem>relatedItemIdentifier |  | cannot be mapped, because information is not given in 3.1 |
| / |  | relatedItems>relatedItem>creators |  | cannot be mapped, because information is not given in 3.1 |
| / |  | … |  | cannot be mapped, because information is not given in 3.1 |
| / |  | relatedItems>relatedItem>titles |  | cannot be mapped, because information is not given in 3.1 |
| / |  | …. |  | cannot be mapped, because information is not given in 3.1 |
| / |  | relatedItems>relatedItem>publicationYear |  | cannot be mapped, because information is not given in 3.1 |
| / |  | relatedItems>relatedItem>volume |  | cannot be mapped, because information is not given in 3.1 |
| / |  | … |  | cannot be mapped, because information is not given in 3.1 |
| / |  | relatedItems>relatedItem>issue |  | cannot be mapped, because information is not given in 3.1 |
| / |  | relatedItems>relatedItem>number |  | cannot be mapped, because information is not given in 3.1 |
| / |  | … |  | cannot be mapped, because information is not given in 3.1 |
| / |  | relatedItems>relatedItem>firstPage |  | cannot be mapped, because information is not given in 3.1 |
| / |  | relatedItems>relatedItem>lastPage |  | cannot be mapped, because information is not given in 3.1 |
| / |  | relatedItems>relatedItem>publisher |  | cannot be mapped, because information is not given in 3.1 |
| / |  | … |  | cannot be mapped, because information is not given in 3.1 |
| / |  | relatedItems>relatedItem>edition |  | cannot be mapped, because information is not given in 3.1 |
| / |  | … |  | cannot be mapped, because information is not given in 3.1 |
| / |  | relatedItems>relatedItem>contributors |  | cannot be mapped, because information is not given in 3.1 |
