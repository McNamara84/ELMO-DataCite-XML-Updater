<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:ns0="http://datacite.org/schema/kernel-3" xmlns:tbf="http://www.altova.com/MapForce/UDF/tbf" xmlns:vmf="http://www.altova.com/MapForce/UDF/vmf" xmlns:agt="http://www.altova.com/Mapforce/agt" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:xml="http://www.w3.org/XML/1998/namespace" exclude-result-prefixes="ns0 tbf vmf agt xs">
	<xsl:template name="tbf:tbf1_">
		<xsl:param name="input" select="/.."/>
		<xsl:for-each select="$input/@identifierType">
			<xsl:variable name="var1_current" select="."/>
			<xsl:attribute name="identifierType">
				<xsl:value-of select="."/>
			</xsl:attribute>
		</xsl:for-each>
		<xsl:value-of select="$input"/>
	</xsl:template>
	<xsl:template name="tbf:tbf2_nameIdentifier">
		<xsl:param name="input" select="/.."/>
		<xsl:for-each select="$input/@nameIdentifierScheme">
			<xsl:variable name="var1_current" select="."/>
			<xsl:attribute name="nameIdentifierScheme">
				<xsl:value-of select="."/>
			</xsl:attribute>
		</xsl:for-each>
		<xsl:for-each select="$input/@schemeURI">
			<xsl:variable name="var2_current" select="."/>
			<xsl:attribute name="schemeURI">
				<xsl:value-of select="."/>
			</xsl:attribute>
		</xsl:for-each>
		<xsl:value-of select="$input"/>
	</xsl:template>
	<xsl:template name="tbf:tbf3_">
		<xsl:param name="input" select="/.."/>
		<xsl:for-each select="$input/@titleType">
			<xsl:variable name="var1_current" select="."/>
			<xsl:attribute name="titleType">
				<xsl:value-of select="."/>
			</xsl:attribute>
		</xsl:for-each>
		<xsl:for-each select="$input/@xml:lang">
			<xsl:variable name="var2_current" select="."/>
			<xsl:attribute name="xml:lang">
				<xsl:value-of select="."/>
			</xsl:attribute>
		</xsl:for-each>
		<xsl:value-of select="$input"/>
	</xsl:template>
	<xsl:template name="tbf:tbf4_">
		<xsl:param name="input" select="/.."/>
		<xsl:for-each select="$input/@alternateIdentifierType">
			<xsl:variable name="var1_current" select="."/>
			<xsl:attribute name="alternateIdentifierType">
				<xsl:value-of select="."/>
			</xsl:attribute>
		</xsl:for-each>
		<xsl:value-of select="$input"/>
	</xsl:template>
	<xsl:template name="vmf:vmf1_inputtoresult">
		<xsl:param name="input" select="/.."/>
		<xsl:choose>
			<xsl:when test="$input='Crossref Funder ID'">
				<xsl:value-of select="'Crossref Funder ID'"/>
			</xsl:when>
			<xsl:when test="$input='GRID'">
				<xsl:value-of select="'GRID'"/>
			</xsl:when>
			<xsl:when test="$input='ISNI'">
				<xsl:value-of select="'ISNI'"/>
			</xsl:when>
			<xsl:when test="$input='ROR'">
				<xsl:value-of select="'ROR'"/>
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="'Other'"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
	<xsl:output method="xml" encoding="UTF-8" indent="yes"/>
	<xsl:template name="agt:MapTometadata_var2">
		<xsl:param name="par1"/>
		<xsl:attribute name="resourceTypeGeneral">
			<xsl:value-of select="$par1"/>
		</xsl:attribute>
	</xsl:template>
	<xsl:template match="/">
		<xsl:variable name="var1_initial" select="."/>
		<resource xmlns="http://datacite.org/schema/kernel-4">
			<xsl:attribute name="xsi:schemaLocation" namespace="http://www.w3.org/2001/XMLSchema-instance">http://datacite.org/schema/kernel-4 file:///C:/xampp/htdocs/MDE-MSL/ELMO-DataCite-XML-Updater/meta/kernel-4.6/metadata.xsd</xsl:attribute>
			<xsl:for-each select="ns0:resource">
				<xsl:variable name="var3_cur" select="."/>
				<identifier>
					<xsl:call-template name="tbf:tbf1_">
						<xsl:with-param name="input" select="ns0:identifier"/>
					</xsl:call-template>
				</identifier>
				<creators>
					<xsl:for-each select="ns0:creators/ns0:creator">
						<xsl:variable name="var4_cur" select="."/>
						<creator>
							<creatorName>
								<xsl:value-of select="ns0:creatorName"/>
							</creatorName>
							<xsl:for-each select="ns0:nameIdentifier">
								<xsl:variable name="var5_cur" select="."/>
								<nameIdentifier>
									<xsl:call-template name="tbf:tbf2_nameIdentifier">
										<xsl:with-param name="input" select="."/>
									</xsl:call-template>
								</nameIdentifier>
							</xsl:for-each>
							<xsl:for-each select="ns0:affiliation">
								<xsl:variable name="var6_cur" select="."/>
								<affiliation>
									<xsl:value-of select="."/>
								</affiliation>
							</xsl:for-each>
						</creator>
					</xsl:for-each>
				</creators>
				<titles>
					<xsl:for-each select="ns0:titles/ns0:title">
						<xsl:variable name="var7_cur" select="."/>
						<title>
							<xsl:call-template name="tbf:tbf3_">
								<xsl:with-param name="input" select="."/>
							</xsl:call-template>
						</title>
					</xsl:for-each>
				</titles>
				<publisher>
					<xsl:value-of select="ns0:publisher"/>
				</publisher>
				<publicationYear>
					<xsl:value-of select="ns0:publicationYear"/>
				</publicationYear>
				<xsl:choose>
					<xsl:when test="ns0:resourceType">
						<xsl:for-each select="ns0:resourceType">
							<xsl:variable name="var8_cur" select="."/>
							<xsl:choose>
								<xsl:when test="((string-length(string(.)) &gt; '0') and boolean($var3_cur/ns0:resourceType))">
									<xsl:for-each select="$var3_cur/ns0:resourceType">
										<xsl:variable name="var9_cur" select="."/>
										<resourceType>
											<xsl:if test="not($var3_cur/ns0:resourceType)">
												<xsl:call-template name="agt:MapTometadata_var2">
													<xsl:with-param name="par1" select="'Dataset'"/>
												</xsl:call-template>
											</xsl:if>
											<xsl:if test="$var3_cur/ns0:resourceType">
												<xsl:for-each select="$var3_cur/ns0:resourceType">
													<xsl:variable name="var10_cur" select="."/>
													<xsl:call-template name="agt:MapTometadata_var2">
														<xsl:with-param name="par1" select="string(@resourceTypeGeneral)"/>
													</xsl:call-template>
												</xsl:for-each>
											</xsl:if>
											<xsl:value-of select="."/>
										</resourceType>
									</xsl:for-each>
								</xsl:when>
								<xsl:otherwise>
									<resourceType>
										<xsl:if test="not($var3_cur/ns0:resourceType)">
											<xsl:call-template name="agt:MapTometadata_var2">
												<xsl:with-param name="par1" select="'Dataset'"/>
											</xsl:call-template>
										</xsl:if>
										<xsl:if test="$var3_cur/ns0:resourceType">
											<xsl:for-each select="$var3_cur/ns0:resourceType">
												<xsl:variable name="var11_cur" select="."/>
												<xsl:call-template name="agt:MapTometadata_var2">
													<xsl:with-param name="par1" select="string(@resourceTypeGeneral)"/>
												</xsl:call-template>
											</xsl:for-each>
										</xsl:if>
										<xsl:value-of select="'Dataset'"/>
									</resourceType>
								</xsl:otherwise>
							</xsl:choose>
						</xsl:for-each>
					</xsl:when>
					<xsl:when test="((string-length('Dataset') &gt; '0') and boolean(ns0:resourceType))">
						<xsl:for-each select="ns0:resourceType">
							<xsl:variable name="var12_cur" select="."/>
							<resourceType>
								<xsl:if test="not($var3_cur/ns0:resourceType)">
									<xsl:call-template name="agt:MapTometadata_var2">
										<xsl:with-param name="par1" select="'Dataset'"/>
									</xsl:call-template>
								</xsl:if>
								<xsl:if test="$var3_cur/ns0:resourceType">
									<xsl:for-each select="$var3_cur/ns0:resourceType">
										<xsl:variable name="var13_cur" select="."/>
										<xsl:call-template name="agt:MapTometadata_var2">
											<xsl:with-param name="par1" select="string(@resourceTypeGeneral)"/>
										</xsl:call-template>
									</xsl:for-each>
								</xsl:if>
								<xsl:value-of select="."/>
							</resourceType>
						</xsl:for-each>
					</xsl:when>
					<xsl:otherwise>
						<resourceType>
							<xsl:if test="not(ns0:resourceType)">
								<xsl:call-template name="agt:MapTometadata_var2">
									<xsl:with-param name="par1" select="'Dataset'"/>
								</xsl:call-template>
							</xsl:if>
							<xsl:if test="ns0:resourceType">
								<xsl:for-each select="ns0:resourceType">
									<xsl:variable name="var14_cur" select="."/>
									<xsl:call-template name="agt:MapTometadata_var2">
										<xsl:with-param name="par1" select="string(@resourceTypeGeneral)"/>
									</xsl:call-template>
								</xsl:for-each>
							</xsl:if>
							<xsl:value-of select="'Dataset'"/>
						</resourceType>
					</xsl:otherwise>
				</xsl:choose>
				<xsl:for-each select="ns0:subjects">
					<xsl:variable name="var15_cur" select="."/>
					<subjects>
						<xsl:for-each select="ns0:subject">
							<xsl:variable name="var16_cur" select="."/>
							<subject>
								<xsl:for-each select="@subjectScheme">
									<xsl:variable name="var17_cur" select="."/>
									<xsl:attribute name="subjectScheme" namespace="">
										<xsl:value-of select="."/>
									</xsl:attribute>
								</xsl:for-each>
								<xsl:for-each select="@schemeURI">
									<xsl:variable name="var18_cur" select="."/>
									<xsl:attribute name="schemeURI" namespace="">
										<xsl:value-of select="."/>
									</xsl:attribute>
								</xsl:for-each>
								<xsl:for-each select="@xml:lang">
									<xsl:variable name="var19_cur" select="."/>
									<xsl:attribute name="xml:lang">
										<xsl:value-of select="."/>
									</xsl:attribute>
								</xsl:for-each>
								<xsl:value-of select="."/>
							</subject>
						</xsl:for-each>
					</subjects>
				</xsl:for-each>
				<contributors>
					<xsl:for-each select="(./ns0:contributors/ns0:contributor)[not(contains(@contributorType, 'Funder'))]">
						<xsl:variable name="var20_filter" select="."/>
						<contributor>
							<xsl:attribute name="contributorType" namespace="">
								<xsl:value-of select="@contributorType"/>
							</xsl:attribute>
							<xsl:if test="not(contains(@contributorType, 'Funder'))">
								<contributorName>
									<xsl:value-of select="ns0:contributorName"/>
								</contributorName>
							</xsl:if>
							<xsl:for-each select="ns0:nameIdentifier">
								<xsl:variable name="var21_cur" select="."/>
								<nameIdentifier>
									<xsl:call-template name="tbf:tbf2_nameIdentifier">
										<xsl:with-param name="input" select="."/>
									</xsl:call-template>
								</nameIdentifier>
							</xsl:for-each>
							<xsl:for-each select="ns0:affiliation">
								<xsl:variable name="var22_cur" select="."/>
								<affiliation>
									<xsl:value-of select="."/>
								</affiliation>
							</xsl:for-each>
						</contributor>
					</xsl:for-each>
				</contributors>
				<xsl:for-each select="ns0:dates">
					<xsl:variable name="var23_cur" select="."/>
					<dates>
						<xsl:for-each select="ns0:date">
							<xsl:variable name="var24_cur" select="."/>
							<date>
								<xsl:attribute name="dateType" namespace="">
									<xsl:value-of select="@dateType"/>
								</xsl:attribute>
								<xsl:value-of select="."/>
							</date>
						</xsl:for-each>
					</dates>
				</xsl:for-each>
				<xsl:for-each select="ns0:language">
					<xsl:variable name="var25_cur" select="."/>
					<language>
						<xsl:value-of select="."/>
					</language>
				</xsl:for-each>
				<xsl:for-each select="ns0:alternateIdentifiers">
					<xsl:variable name="var26_cur" select="."/>
					<alternateIdentifiers>
						<xsl:for-each select="ns0:alternateIdentifier">
							<xsl:variable name="var27_cur" select="."/>
							<alternateIdentifier>
								<xsl:call-template name="tbf:tbf4_">
									<xsl:with-param name="input" select="."/>
								</xsl:call-template>
							</alternateIdentifier>
						</xsl:for-each>
					</alternateIdentifiers>
				</xsl:for-each>
				<xsl:for-each select="ns0:relatedIdentifiers">
					<xsl:variable name="var28_cur" select="."/>
					<relatedIdentifiers>
						<xsl:for-each select="ns0:relatedIdentifier">
							<xsl:variable name="var29_cur" select="."/>
							<relatedIdentifier>
								<xsl:attribute name="relatedIdentifierType" namespace="">
									<xsl:value-of select="@relatedIdentifierType"/>
								</xsl:attribute>
								<xsl:attribute name="relationType" namespace="">
									<xsl:value-of select="@relationType"/>
								</xsl:attribute>
								<xsl:for-each select="@relatedMetadataScheme">
									<xsl:variable name="var30_cur" select="."/>
									<xsl:attribute name="relatedMetadataScheme" namespace="">
										<xsl:value-of select="."/>
									</xsl:attribute>
								</xsl:for-each>
								<xsl:for-each select="@schemeURI">
									<xsl:variable name="var31_cur" select="."/>
									<xsl:attribute name="schemeURI" namespace="">
										<xsl:value-of select="."/>
									</xsl:attribute>
								</xsl:for-each>
								<xsl:for-each select="@schemeType">
									<xsl:variable name="var32_cur" select="."/>
									<xsl:attribute name="schemeType" namespace="">
										<xsl:value-of select="."/>
									</xsl:attribute>
								</xsl:for-each>
								<xsl:value-of select="."/>
							</relatedIdentifier>
						</xsl:for-each>
					</relatedIdentifiers>
				</xsl:for-each>
				<xsl:for-each select="ns0:sizes">
					<xsl:variable name="var33_cur" select="."/>
					<sizes>
						<xsl:for-each select="ns0:size">
							<xsl:variable name="var34_cur" select="."/>
							<size>
								<xsl:value-of select="."/>
							</size>
						</xsl:for-each>
					</sizes>
				</xsl:for-each>
				<xsl:for-each select="ns0:formats">
					<xsl:variable name="var35_cur" select="."/>
					<formats>
						<xsl:for-each select="ns0:format">
							<xsl:variable name="var36_cur" select="."/>
							<format>
								<xsl:value-of select="."/>
							</format>
						</xsl:for-each>
					</formats>
				</xsl:for-each>
				<xsl:for-each select="ns0:version">
					<xsl:variable name="var37_cur" select="."/>
					<version>
						<xsl:value-of select="."/>
					</version>
				</xsl:for-each>
				<xsl:for-each select="ns0:rightsList">
					<xsl:variable name="var38_cur" select="."/>
					<rightsList>
						<xsl:for-each select="ns0:rights">
							<xsl:variable name="var39_cur" select="."/>
							<rights>
								<xsl:for-each select="@rightsURI">
									<xsl:variable name="var40_cur" select="."/>
									<xsl:attribute name="rightsURI" namespace="">
										<xsl:value-of select="."/>
									</xsl:attribute>
								</xsl:for-each>
								<xsl:value-of select="."/>
							</rights>
						</xsl:for-each>
					</rightsList>
				</xsl:for-each>
				<xsl:for-each select="ns0:descriptions">
					<xsl:variable name="var41_cur" select="."/>
					<descriptions>
						<xsl:for-each select="ns0:description">
							<xsl:variable name="var42_cur" select="."/>
							<description>
								<xsl:attribute name="descriptionType" namespace="">
									<xsl:value-of select="@descriptionType"/>
								</xsl:attribute>
								<xsl:for-each select="@xml:lang">
									<xsl:variable name="var43_cur" select="."/>
									<xsl:attribute name="xml:lang">
										<xsl:value-of select="."/>
									</xsl:attribute>
								</xsl:for-each>
								<xsl:for-each select="node()">
									<xsl:variable name="var44_sd" select="."/>
									<xsl:if test="self::text()">
										<xsl:value-of select="."/>
									</xsl:if>
									<xsl:if test="self::ns0:br">
										<br/>
									</xsl:if>
								</xsl:for-each>
							</description>
						</xsl:for-each>
					</descriptions>
				</xsl:for-each>
				<xsl:for-each select="ns0:geoLocations">
					<xsl:variable name="var45_cur" select="."/>
					<geoLocations>
						<xsl:for-each select="ns0:geoLocation">
							<xsl:variable name="var46_cur" select="."/>
							<geoLocation>
								<xsl:for-each select="ns0:geoLocationPlace">
									<xsl:variable name="var47_cur" select="."/>
									<geoLocationPlace>
										<xsl:for-each select="(./node())[./self::text()]">
											<xsl:variable name="var48_filter" select="."/>
											<xsl:value-of select="."/>
										</xsl:for-each>
									</geoLocationPlace>
								</xsl:for-each>
								<xsl:for-each select="ns0:geoLocationPoint">
									<xsl:variable name="var49_cur" select="."/>
									<geoLocationPoint>
										<pointLongitude>
											<xsl:value-of select="number(substring-after(., ' '))"/>
										</pointLongitude>
										<pointLatitude>
											<xsl:value-of select="number(substring-before(., ' '))"/>
										</pointLatitude>
									</geoLocationPoint>
								</xsl:for-each>
								<xsl:for-each select="ns0:geoLocationBox">
									<xsl:variable name="var50_cur" select="."/>
									<geoLocationBox>
										<westBoundLongitude>
											<xsl:value-of select="number(substring-before(substring-after(., ' '), ' '))"/>
										</westBoundLongitude>
										<eastBoundLongitude>
											<xsl:value-of select="number(substring-after(substring-after(substring-after(., ' '), ' '), ' '))"/>
										</eastBoundLongitude>
										<southBoundLatitude>
											<xsl:value-of select="number(substring-before(., ' '))"/>
										</southBoundLatitude>
										<northBoundLatitude>
											<xsl:value-of select="number(substring-before(substring-after(substring-after(., ' '), ' '), ' '))"/>
										</northBoundLatitude>
									</geoLocationBox>
								</xsl:for-each>
							</geoLocation>
						</xsl:for-each>
					</geoLocations>
				</xsl:for-each>
				<xsl:for-each select="ns0:contributors">
					<xsl:variable name="var51_filter" select="."/>
					<xsl:variable name="var52_nested">
						<xsl:for-each select="ns0:contributor">
							<xsl:variable name="var53_cur" select="."/>
							<xsl:value-of select="number(contains(@contributorType, 'Funder'))"/>
						</xsl:for-each>
					</xsl:variable>
					<xsl:if test="boolean(translate(normalize-space($var52_nested), ' 0', ''))">
						<fundingReferences>
							<xsl:for-each select="(./ns0:contributor)[contains(@contributorType, 'Funder')]">
								<xsl:variable name="var54_filter" select="."/>
								<fundingReference>
									<xsl:if test="contains(@contributorType, 'Funder')">
										<funderName>
											<xsl:value-of select="ns0:contributorName"/>
										</funderName>
									</xsl:if>
									<xsl:for-each select="(./ns0:nameIdentifier)[contains($var54_filter/@contributorType, 'Funder')]">
										<xsl:variable name="var55_filter" select="."/>
										<funderIdentifier>
											<xsl:if test="contains($var54_filter/@contributorType, 'Funder')">
												<xsl:attribute name="funderIdentifierType" namespace="">
													<xsl:variable name="var56_nested">
														<xsl:call-template name="vmf:vmf1_inputtoresult">
															<xsl:with-param name="input" select="string(@nameIdentifierScheme)"/>
														</xsl:call-template>
													</xsl:variable>
													<xsl:value-of select="$var56_nested"/>
												</xsl:attribute>
											</xsl:if>
											<xsl:for-each select="(./@schemeURI)[contains($var54_filter/@contributorType, 'Funder')]">
												<xsl:variable name="var57_filter" select="."/>
												<xsl:attribute name="schemeURI" namespace="">
													<xsl:value-of select="."/>
												</xsl:attribute>
											</xsl:for-each>
											<xsl:for-each select="@schemeURI">
												<xsl:variable name="var58_filter" select="."/>
												<xsl:copy-of select="/.."/>
											</xsl:for-each>
											<xsl:value-of select="."/>
										</funderIdentifier>
									</xsl:for-each>
								</fundingReference>
							</xsl:for-each>
						</fundingReferences>
					</xsl:if>
				</xsl:for-each>
			</xsl:for-each>
		</resource>
	</xsl:template>
</xsl:stylesheet>
